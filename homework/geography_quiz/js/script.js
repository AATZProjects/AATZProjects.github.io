document.querySelector("button").addEventListener("click", gradeQuiz);
let score = 0
let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
    attempts = 0;
} else {
    attempts = Number(attempts);
}

// DISPLAY CHOICES for q4, q8, q9
displayRadioChoices(["Maine", "Rhode Island", "Maryland", "Delaware"], document.querySelector("#q4Choices"), "q4");
displayRadioChoices(["California", "Texas", "Florida", "New York"], document.querySelector("#q8Choices"), "q8");
displayRadioChoices(["Lake Superior", "Lake Michigan", "Lake Ontario", "Lake Eerie"], document.querySelector("#q9Choices"), "q9");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}



function displayRadioChoices(array, choicesContainer, questionName) {
    // Shuffle the array
    shuffleArray(array);

    // Given the id for the container, empty the string
    choicesContainer.textContent = "";

    for (let choice of array) {
        let input = document.createElement("input");
        input.type = "radio";
        input.name = questionName;
        input.id = choice;
        input.value = choice;

        let label = document.createElement("label");
        label.htmlFor = choice;
        label.textContent = choice;

        choicesContainer.appendChild(input);
        choicesContainer.appendChild(label);
        choicesContainer.appendChild(document.createTextNode(" "));
    }
}

function isFormValid() {
    let isValid = true;
    let q1Response = document.querySelector("#q1").value;
    let validationFdbk = document.querySelector("#validationFdbk");

    // Check if Question 3 was answered
    let q3Answered = (document.querySelector("#Jefferson").checked || 
        document.querySelector("#Roosevelt").checked || 
        document.querySelector("#Jackson").checked ||
        document.querySelector("#Franklin").checked);

    // Check if Question 5 was answered
    let q5Answered = (
        document.querySelector("#gLA").checked ||
        document.querySelector("#gFL").checked ||
        document.querySelector("#gGA").checked ||
        document.querySelector("#gTX").checked
    );


    if (q1Response === "" ||                                            // Check Q1
        document.querySelector("#q2").value == "" ||                    // Check Q2
        !q3Answered ||                                                  // Check Q3
        document.querySelector("input[name=q4]:checked") === null ||    // Check Q4
        !q5Answered ||                                                  // Check Q5
        document.querySelector("#q6").value === null ||                 // Check Q6
        document.querySelector("#q7").value === null ||                 // Check Q7
        document.querySelector("input[name=q8]:checked") === null ||    // Check Q8
        document.querySelector("input[name=q9]:checked") === null ||    // Check Q9
        document.querySelector("#q10").value === ""                     // Check Q10
    ) {
        isValid = false;
        validationFdbk.textContent = "Please answer all questions!";
    }

    return isValid;
}



function setMarkImage(index, imageName, altText) {
    let markContainer = document.querySelector(`#markImg${index}`);
    markContainer.textContent = "";

    let img = document.createElement("img");
    img.src = `img/${imageName}`;
    img.alt = altText;
    img.style.height = "35px";
    img.style.width = "35px";
    markContainer.appendChild(img);
}

function rightAnswer(index) {
    let feedback = document.querySelector(`#q${index}Feedback`);
    feedback.textContent = "Correct!";
    feedback.className = "bg-success text-white";
    setMarkImage(index, "checkmark.png", "Checkmark");
    score += 10;
}

function wrongAnswer(index) {
    let feedback = document.querySelector(`#q${index}Feedback`);
    feedback.textContent = "Incorrect!";
    feedback.className = "bg-warning text-white";
    setMarkImage(index, "xmark.png", "X mark");
}

function gradeQuiz() {
    document.querySelector("#validationFdbk").textContent = "";

    if (!isFormValid()) {
        return;
    }

    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;

    // Reset the score in case the user retries.
    score = 0;

    // Q1
    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // Q2
    if (q2Response === "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // Q3
    if (document.querySelector("#Jefferson").checked && 
        document.querySelector("#Roosevelt").checked && 
        !document.querySelector("#Jackson").checked &&
        !document.querySelector("#Franklin").checked) {
            rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // Q4
    let selectedQ4 = document.querySelector("input[name=q4]:checked");

    if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Q5
    if (document.querySelector("#gLA").checked &&
        document.querySelector("#gFL").checked &&
        !document.querySelector("#gGA").checked &&
        document.querySelector("#gTX").checked
    ) {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // Q6
    if (document.querySelector("#q6").value == 13) {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // Q7
    if (document.querySelector("#q7").value === "ok") {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // Q8
    let selectedQ8 = document.querySelector("input[name=q8]:checked");

    if (selectedQ8 !== null && selectedQ8.value === "California") {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }


    // Q9
    let selectedQ9 = document.querySelector("input[name=q9]:checked");

    if (selectedQ9 !== null && selectedQ9.value === "Lake Superior") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // Q10
    if (document.querySelector("#q10").value.toLowerCase() === "alaska") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }


    // Display total score:
    document.querySelector("#totalScore").textContent = `Total Score: ${score}`;
    if (score < 80) {
        document.querySelector("#totalScore").className = "text-danger"
    } else {
        document.querySelector("#totalScore").className = "text-success";

        if (score > 80) {
            document.querySelector("#congratulations").textContent = "Wow! Awesome job!";
        }
    }

    // Display and Update total attempts
    attempts++;
    document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);
}