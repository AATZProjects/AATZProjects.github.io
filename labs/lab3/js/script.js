document.querySelector("#zip").addEventListener("change", displayCity);
document.addEventListener("DOMContentLoaded", loadStates);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

document.querySelector("#password").addEventListener("change", checkPassword);
document.querySelector("#passwordAgain").addEventListener("change", checkPassword);

document.querySelector("#state").addEventListener("change", updateCounty);
document.querySelector("#password").addEventListener("click", suggestPassword);


// Async - allows us to wait for API response
async function displayCity() {
    // alert(document.querySelector("#zip").value);

    try {
        let zipCode = document.querySelector("#zip").value;
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
        let response = await fetch(url);
        let data = await response.json();

        // If the API returns false then the zip code was not found - avoid checking city
        if (data === false) {
            document.querySelector("#city").textContent = "Zip code not found!";
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
      option.textContent = item.state;
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

function checkPassword() {
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");

    passwordError.textContent = "";


    // Check if Password is valid length: n >= 6
    if (password.length === 0) {
        passwordError.textContent = "Password required!";
        passwordError.style.color = "red";
        return false;
    } else if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters!";
        passwordError.style.color = "red";
        return false;
    }

    // Check if passwords match - only if both passwords are filled in
    if (passwordAgain.length === 0) {
        return false;
    }

    if (password === passwordAgain) {
        passwordError.textContent = "Password is valid!";
        passwordError.style.color = "green";
        return true;
    } else {
        passwordError.textContent = "Passwords do not match!";
        passwordError.style.color = "red";
        return false;
    }
}

async function updateCounty() {
    try {
        let countyMenu = document.querySelector("#county");

        // Loop through and clear the previous values
        for (let i = countyMenu.options.length - 1; i >= 0; i--) {
            countyMenu.remove(i);
        }

        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select One";
        countyMenu.appendChild(defaultOption);

        let state = document.querySelector("#state").value;     // Abbreviation of selected state
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let response = await fetch(url);
        let data = await response.json();


        // Loop through the returned values and create an options list of the counties for the specific state
        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.county;
            option.textContent = item.county;
            countyMenu.appendChild(option);
        }

        // Update the state to select index 0
        countyMenu.selectedIndex = 0;
    } catch (error) {
        console.error(error);
    }
}

async function suggestPassword() {
    suggestedPassword = document.querySelector("#suggestedPassword");

    try {
        let suggestedLength = 8;
        let url = `https://csumb.space/api/suggestedPassword.php?length=${suggestedLength}`;
        let response = await fetch(url);
        let data = await response.json();

        suggestedPassword.textContent = "Suggested password: " + data.password;
    } catch (error) {
        console.error(error);
    }
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

  if (!checkPassword()) {
    isValid = false;
  }

  if (isValid) {
    document.querySelector("#signupForm").submit();
  }
}

