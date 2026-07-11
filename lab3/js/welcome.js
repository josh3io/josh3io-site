
document.addEventListener("DOMContentLoaded", () => {
  let formDataContainer = document.querySelector("#formData");

  let queryString = document.location.search;
  let params = new URLSearchParams(queryString);

  params.keys().forEach(key => {
    console.log(key)
    try {
      if (!key.startsWith("password")) {
        let rowDiv = document.createElement('div');
        rowDiv.className = "row striped";
        let keyDiv = document.createElement('div');
        keyDiv.className = "col";
        keyDiv.textContent = key;
        rowDiv.appendChild(keyDiv);
        let valueDiv = document.createElement('div');
        valueDiv.className = "col";
        valueDiv.textContent = params.get(key);
        rowDiv.appendChild(valueDiv);
        formDataContainer.prepend(rowDiv);
      }
    } catch(error){ 
      console.error(`Failed to list field ${key}: ${error}`);
    }
  });

  if (params.get('password')) {
    document.querySelector('#passwordRow').className = "row";
  }
});
