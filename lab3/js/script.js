document.querySelector("#zip").addEventListener("change", displayCity);


async function displayCity() {
  try {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    //the API returns false when the zip code is not found, so we can check for that case before trying to access the city property
    if (data === false) {
      let zipError = document.querySelector("#zipError");
      zipError.textContent = "Zip code not found.";
      zipError.style.color = "red";
      document.querySelector("#latitude").textContent = "";
      document.querySelector("#longitude").textContent = "";
      return;
    }

    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;

  } catch (error) {
    document.querySelector("#city").textContent = "Unable to retrieve city";
    console.error(error);
  }
}

async function loadStates() {
  let stateMenu = document.querySelector("#state");
  stateMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  stateMenu.appendChild(defaultOption);

  try {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.usps;
      option.textContent = item.state
      stateMenu.appendChild(option);
    }

  } catch (error) {
    console.error(error);
    stateMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    stateMenu.appendChild(errorOption);
  }
}

async function loadCounties() {
  let countyMenu = document.querySelector("#county");
  countyMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  countyMenu.appendChild(defaultOption);

  let state = document.querySelector("#state option:checked").value;
  if (state.length != 2) {
    console.error("invalid state selected: ${state}");
    return;
  }

  try {
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.county;
      option.textContent = item.county;
      countyMenu.appendChild(option);
    }

  } catch (error) {
    console.error(error);
    countyMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load counties";
    countyMenu.appendChild(errorOption);
  }
}


async function checkUsername() {
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    return false;
  }

  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  if (data.available) {
    usernameError.textContent = "Username available!";
    usernameError.style.color = "green";
    return true;
  } else {
    usernameError.textContent = "Username taken";
    usernameError.style.color = "red";
    return false;
  }
}

async function suggestPassword() {
  const url = "https://csumb.space/api/suggestedPassword.php?length=8";
  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.password) {
      document.querySelector("#suggestedPassword").className = "d-block m-1 d-flex align-items-center justify-content-center";
      document.querySelector("#passwordMessage").textContent = "Suggested password (click to use):";
      document.querySelector("#passwordMessage").style.color = "green";
      document.querySelector("#passwordSuggestion").textContent = data.password;
      document.querySelector("#passwordSuggestion").style.color = "green";
    }
  } catch(error) {
    console.error(error);
    document.querySelector("#suggestedPassword").className = "d-block m-1 d-flex align-items-center justify-content-center";
    document.querySelector("#passwordMessage").textContent = "error getting password suggestion";
    document.querySelector("#passwordMessage").style.color = "red";
    document.querySelector("#passwordSuggestion").textContent = "";

  }
}

function populatePassword() {
  let pass = document.querySelector("#passwordSuggestion").textContent;
  if (pass.length > 0) {
    document.querySelector("#password").value = pass;
    document.querySelector("#passwordAgain").value = pass;
  }
}

function validatePassword() {
  let password = document.querySelector("#password").value;
  let passwordAgain = document.querySelector("#passwordAgain").value;

  let errorSpan = document.querySelector("#passwordError");
  errorSpan.textContent = "";

  if (password.length >= 6 && passwordAgain.length >= 6) {
    if (password != passwordAgain) {
      errorSpan.textContent = "Password confirmation doesn't match";
      return false;
    }
  } else if (password.length < 6) {
    errorSpan.textContent = "Password must be at least 6 characters";
    return false;
  }
  return true;
}


async function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  usernameError.textContent = "";

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    isValid = false;
  } else {
    let usernameAvailable = await checkUsername();

    if (usernameAvailable === false) {
      isValid = false;
    }
  }

  if (!validatePassword()) {
    isvalid = false;
  }

  if (isValid) {
    document.querySelector("#signupForm").submit();
  }
}

document.addEventListener("DOMContentLoaded", loadStates);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#suggestedPassword").addEventListener("click", populatePassword);
