document.querySelector("button").addEventListener("click", gradeQuiz);

function isFormValid() {
    let isValid = true;
    let q1Response = document.querySelector("#q1").value;
    let validationFdbk = document.querySelector("#validationFdbk");

    if (q1Response === "") {
        isValid = false;
        validationFdbk.textContent = "Question 1 was not answered";
    }

    return isValid;
}

function gradeQuiz() {
    document.querySelector("#validationFdbk").textContent = "";

    if (!isFormValid()) {
        return;
    }

    let score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q1Feedback = document.querySelector("#q1Feedback");
    let markImg1 = document.querySelector("markImg1");

    q1Feedback.textContent = "";
    q1Feedback.className = "";
    markImg1.textContent = "";

    if (q1Response === "sacramento") {
        q1Feedback.textContent = "Correct!";
        q1Feedback.className = "bg-success text-white";

        let img = document.createElement("img");
        img.src = "img/checkmark.png";
        img.alt = "Checkmark";
        markImg1.appendChild(img);

        score += 20;
    } else {
        q1Feedback.textContent = "Incorrect!";
        q1Feedback.className = "bg-warning text-white";

        let img = document.createElement("img");
        img.src = "img/xmark.png";
        img.alt = "X mark";
        markImg1.appendChild(img)
    }

    document.querySelector("#totalScore").textContent = `Total Score: ${score}`;
}