
const API_KEY = "5e577bf14884ff3a257b8a49b8e21cea";
const API_KEY_2 = "be8057b5cf4bdfe05786550b97833f83";

const API_BASE_URL = "https://data.fixer.io/api";

async function fixerApiCall(_url, api_key=null) {
  let url;
  if (api_key) {
    url = _url.replace("_API_KEY_", api_key);
  } else {
    url = _url.replace("_API_KEY_", API_KEY);
  }
  let response = await fetch(url);
  if (response.status == 429 && api_key != API_KEY_2) {
    // api limit reached, try backup key
    return fixerApiCall(url, API_KEY_2);
  }

  return response;
}


async function getSymbols() {
  try {
    let symbolsData = JSON.parse(localStorage.getItem("symbols"));

    // get symbols list at most once per day
    if (symbolsData == null || symbolsData.timestamp < Date.now() - 86400 * 1000) {
      let url = `${API_BASE_URL}/symbols?access_key=_API_KEY_`;
      let response = await fixerApiCall(url);
      let data = await response.json();

      symbolsData = {
        "timestamp": Date.now(),
        "symbols": data.symbols
      };
      localStorage.setItem("symbols", JSON.stringify(symbolsData));
    }


    let symbolSelect = document.querySelector('#symbols')

    symbolSelect.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Many...";
    defaultOption.disabled="disabled";
    symbolSelect.appendChild(defaultOption.cloneNode(true));

    Object.entries(symbolsData.symbols).forEach(([symbol, name]) => {
      let opt = document.createElement('option');
      opt.value = symbol;
      opt.textContent = name;

      symbolSelect.appendChild(opt.cloneNode(true));
    });
  } catch (error) {
    console.error(error);
    document.querySelector('#symbolsError').textContent = "Erorr retrieving currency symbols";
  }
}

function displayRates(amount, targets) {
  let ratesDiv = document.querySelector('#rates');
  ratesDiv.classList.remove("d-none");
  ratesDiv.textContent = "";

  let symbolsData = JSON.parse(localStorage.getItem("symbols"));
  let ratesCache = JSON.parse(localStorage.getItem("rates"));

  targets.forEach(target => {
    let div = document.createElement('div');
    div.className = "row striped m-1";

    let rate = document.createElement('div');
    rate.className = "col fs-2 col-md-4";
    rate.textContent = Math.round(10000 * ratesCache[target].rate * amount) / 10000;
    div.appendChild(rate);

    let sym = document.createElement('div');
    sym.className = "col fs-2";
    sym.textContent = symbolsData.symbols[target];
    div.appendChild(sym);
    ratesDiv.appendChild(div);
  });
}

async function checkRates(event) {

  const selectedOpts = document.querySelector('#symbols').selectedOptions;
  const targets = Array.from(selectedOpts).map(option => option.value);

  if (!targets) {
    return;
  }

  let amount = parseInt(document.querySelector("#amount").value * 10000) / 10000;
  let amountError = document.querySelector('#amountError');
  amountError.textContent = "";
  if (amount <= 0) {
    amountError.textContent = "Invalid amount. must be numeric. Amount will be rounded to the nearest 0.00001";
    return;
  }

  let ratesCache = JSON.parse(localStorage.getItem("rates"));
  if (!ratesCache) {
    ratesCache = {};
  }
  let cacheInvalid = false;
  let expiry = Date.now() - (86400*1000);
  targets.forEach(target => {
    if (!Object.hasOwn(ratesCache,target) || !ratesCache[target].rate || ratesCache[target].timestamp < expiry) {
      cacheInvalid = true;
    }
  });

  document.querySelector('#displayAmount').textContent = amount;
  document.querySelector('#displayBase').classList.remove("d-none");

  try {
    if (cacheInvalid) {
      let url = `${API_BASE_URL}/latest?access_key=_API_KEY_&base=EUR&symbols=${targets.join(',')}`
      let response = await fixerApiCall(url);
      let data = await response.json();

      let now = Date.now();
      console.log(data)

      targets.forEach(target => {
        ratesCache[target] = {
          "rate": data.rates[target],
          "timestamp": now
        };
      });
      console.log(ratesCache);
      localStorage.setItem("rates", JSON.stringify(ratesCache));
    } else {
    }

    displayRates(amount, targets);
  } catch (error) {
    console.error(error);
    document.querySelector('#symbolsError').textContent = "Erorr checking rates";
  }
}

function clearResults() {
  document.querySelector('#rates').textContent = "";
  document.querySelector('#rates').classList.add("d-none");
  document.querySelector('#displayBase').classList.add("d-none");
}

function updateSubmitBtn() {
  const selectedOpts = document.querySelector('#symbols').selectedOptions;
  const btn = document.querySelector("#fetchRatesBtn");
  btn.value = "Get Rates";
  if (selectedOpts.length == 0) {
    btn.disabled = "disabled";
    return;
  }
  btn.disabled = false;

  if (selectedOpts.length == 1) {
    btn.value = "Get Rate";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  getSymbols();

  // this won't change
  document.querySelector("#fetchRatesBtn").addEventListener("click", checkRates);
  document.querySelector("#symbols").addEventListener("focus", clearResults);
  document.querySelector("#symbols").addEventListener("change", updateSubmitBtn);
  document.querySelector("#amount").addEventListener("focus", clearResults);
});
