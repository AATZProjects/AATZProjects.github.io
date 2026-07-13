document.querySelector("#combination-buttons").addEventListener("click", needColorNum);
document.addEventListener("DOMContentLoaded", initPage);
document.querySelector("#generate-form").addEventListener("submit", validateForm);
document.querySelector("#num-colors").addEventListener("change", clearFeedback);
document.querySelector("#chosen-color").addEventListener("change", clearFeedback);

const params = new URLSearchParams(document.location.search);       // Retreive the parameters in the URL from the Form

// Configure Coloris
Coloris({
    theme: 'pill',
    alpha: false,
    onChange: (color, inputEl) => {
        console.log(`The new color is ${color}`);
    }
});

async function initPage() {
    if (containsSearchParams()) {
        restoreForm();
        await displayGradient();
    }
    
    // Sometimes radio buttons stick around on page refresh, we should update it if needed
    needColorNum();
}

function clearFeedback() {
    let feedback = document.querySelector("#submission-feedback");
    feedback.textContent = "";
}


// Returns true if the selected style requires a number of colors, and also updates the section's visibility
function needColorNum() {
    let numColors = document.querySelector("#num-selector");
    let checkedButton = document.querySelector('input[name="combination-type"]:checked');
    clearFeedback();

    if (checkedButton !== null && checkedButton.value !== "complement") {
        // Show the number menu
        numColors.style.visibility = "visible";
        return true;
    } else {
        numColors.style.visibility = "hidden";
        return false;
    }
}

async function validateForm() {
    // Stops the form from submitting
    event.preventDefault();

    // Reset the feedback line
    let feedback = document.querySelector("#submission-feedback");
    feedback.textContent = "";


    // Check if the color is valid
    if (document.querySelector("#chosen-color").value === "") {
        feedback.textContent = "Please select a color!";
        feedback.style.color = "red";
        return;
    }


    // Combination type should not be empty
    if (document.querySelector('input[name="combination-type"]:checked') === null) {
        feedback.textContent = "Please select a combination type!";
        feedback.style.color = "red";
        return;
    }

    // Do we need a number for our combination type?
    if (needColorNum()) {
        // Since we need a number, is the current number in range?
        let numColors = document.querySelector("#num-colors").value;
        if (numColors === null || numColors < 5 || numColors > 10) {
            // Out of range: must be between 5 and 10 (inclusive) colors
            feedback.textContent = "Please choose a number between 5 and 10.";
            feedback.style.color = "red";
            return;
        }
    }

    // The form is ready to submit
    document.querySelector("#generate-form").submit();
}

// === When given a URL that has queries, generate the palette at the bottom === //
function containsSearchParams() {
    if (params.get("color") === null) {
        return false;
    } else {
        return true;
    }
}

async function displayGradient() {
    try {
        let color = params.get("color").substring(1);       // Ommit the "#"
        let mode = params.get("combination-type");
        let count = params.get("num-colors");

        if (mode === "complement") {
            count = 4;

        }

        let url = `https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}&count=${count}`;

        let response = await fetch(url);
        let data = await response.json();

        // Fill an array of the received colors
        let colors = [];
        for (const color of data.colors) {
            colors.push(color.hex.value);
        }

        // For some reason, the API doesn't guarantee it will use the user-selected color as part of the grid, so we have to find the closest color and replace it with the user's color
        // This function takes in an array of colors and a given HEX code, iterates through them, and finds the closest value using Euclidean Distance
        let closestHex = findClosestHex(colors, color);

        // Generate the color grid
        for (let currColor of colors) {
            const swatch = document.createElement("div");
            swatch.className = "cell";

            // If we're on the determined closest color, replace it with the desired color
            if (currColor === closestHex) {
                console.log("The closest hex to " + color + " is " + currColor);
                currColor = "#" + color.toUpperCase();
                console.log("The color will now be reassigned to " + currColor);
            }
            
            swatch.style.backgroundColor = currColor;

            // Make the HEX code a clickable element
            let label = document.createElement("span");     // Text element
            label.className = "copy-text";
            label.textContent = currColor;

            swatch.appendChild(label);

            palette.appendChild(swatch);
        }

        // Find the color with the matching HEX code and change its background color to the desired color
    } catch (error) {
        console.log(error);
    }
}

// Shows the user all the previous information
function restoreForm() {
    const color = params.get("color");
    let colorInput = document.querySelector("#chosen-color");
    colorInput.value = color;
    
    // Updates the Color Picker to update its preview
    colorInput.dispatchEvent(new Event("input", {bubbles: true}));
    colorInput.dispatchEvent(new Event("change", {bubbles: true}));

    const count = params.get("num-colors");
    if (count) {
        document.querySelector("#num-colors").value = count;
    }

    const mode = params.get("combination-type");
    document.querySelector(`input[name="combination-type"][value="${mode}"]`).checked = true;
}

// === Functions for calculating closest HEX code === //
function findClosestHex(colors, desiredColor) {
    // Bug prevention, return on empty array
    if (colors.length === 0) {
        return;
    }

    // Track the first color in the array to be our comparison point, as well as the shortest distance
    let closestColor = colors[0];
    let shortestDistance = calculateHexDistance(closestColor, desiredColor);

    // Bug prevention: is there only one value? If so, return it
    if (colors.length === 1) {
        return closestColor;
    }

    // Loop through each color, starting on the second one
    for (let i = 1; i < colors.length; i++) {
        // Get the Euclidean distance between the current color and the desired color
        let distance = calculateHexDistance(colors[i], desiredColor);
        
        // Is this distance smaller than the saved smallest distance?
        if (distance < shortestDistance) {
            // If so, update the saved smallest distance and saved color to this new one
            closestColor = colors[i];
            shortestDistance = distance;
        }
    }

    console.log("findClosestHex(): The closest hex is: " + closestColor);
    // Return the saved HEX code, appending "#" if needed
    if (closestColor[0] !== "#") {
        console.log("findClosestHex(): Appending #");
        closestColor = "#" + closestColor;
    }

    return closestColor;
}

function calculateHexDistance(hex1, hex2) {
    // Convert hex1 and hex2 into their RGB values - rgb1 and rgb2
    let rgb1 = hexToRgb(hex1);
    let rgb2 = hexToRgb(hex2);

    // Return the result of sqrt((|r1^2 - r2^2|) + (|g1^2 - g2^2|) + (|b1^2 - b2^2|))
    let result = 
        (Math.abs(Math.pow(rgb1[0], 2) - Math.pow(rgb2[0], 2))) + 
        (Math.abs(Math.pow(rgb1[1], 2) - Math.pow(rgb2[1], 2))) + 
        (Math.abs(Math.pow(rgb1[2], 2) - Math.pow(rgb2[2], 2)));

    result = Math.sqrt(result);

    console.log("The resulting distance is: " + result);
    return result;
}

function hexToRgb(hex) {
    console.log("Converting to RGB: " + hex);

    // If the hex starts with #, remove it
    if (hex[0] === "#") {
        hex = hex.substring(1);
    }

    console.log("Formatted HEX: " + hex);

    // Track an array of 3 items, representing R, G, and B
    let rgb = [];

    // Create three substrings of the hex, for characters 0-1, 2-3, and 4-5
    let rString = hex.substring(0, 2);
    let gString = hex.substring(2, 4);
    let bString = hex.substring(4);

    // Append the the array the casted Number("0x" + hex) -> JavaScript's method for converting hex to decimal
    rgb.push(Number("0x" + rString));
    rgb.push(Number("0x" + gString));
    rgb.push(Number("0x" + bString));

    // Return the 3-length array
    return rgb;
}