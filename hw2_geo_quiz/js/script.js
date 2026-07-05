document.querySelector("button").addEventListener("click", gradeQuiz);

let score = 0;
let attempts = localStorage.getItem("total_attempts");

let checkFuncs = [];

if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

displayQ1();
displayQ2Choices();
// skip Q3
displayQ4Choices();
displayQ5Choices();
displayQ6Choices();
displayQ7Choices();
displayQ8Choices();
displayQ9();
displayQ10Choices();

function setMarkImage(index, imageName, altText) {
  let markContainer = document.querySelector(`#markImg${index}`);
  markContainer.textContent = "";

  let img = document.createElement("img");
  img.src = `img/${imageName}`;
  img.alt = altText;
  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Correct!";
  feedback.className = "bg-success text-white text-center p-4";
  setMarkImage(index, "check.jpg", "Checkmark");
  score += 10;
}

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Incorrect!";
  feedback.className = "bg-warning text-white text-center p-4";
  setMarkImage(index, "xmark.jpg", "X mark");
}

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

  score = 0;

  if (document.querySelector("#Jefferson").checked &&
    document.querySelector("#Roosevelt").checked &&
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked) {
    rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  checkFuncs.forEach((func) => {func()});
  
  document.querySelector("#totalScore").textContent = `Total Score: ${score}`;
  if (score < 80) {
    document.querySelector("#totalScore").className = "text-danger";
  } else {
    document.querySelector("#totalScore").className = "text-success";
    document.querySelector("#totalScore").textContent += "! Congrats on the great score!";
  }

  attempts++;
  document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function displayTextQuestion(num, correctAnswer) {
  let name="q"+num;
  checkFuncs.push(() => {
    let value = document.querySelector("#"+name).value;
    if (value == correctAnswer) {
      rightAnswer(num);
    } else {
      wrongAnswer(num);
    }
  });
}

function displayDropdownChoices(num, containerId, choicesArray, correctAnswer) {
  shuffleArray(choicesArray);

  let name="q"+num;

  let choicesContainer = document.querySelector(containerId);
  let option = document.createElement("option");
  option.value = "";
  option.textContent = "Select One";

  for (let choice of choicesArray) {
    let option = document.createElement("option");
    option.value = choice[0];
    option.textContent = choice[1];

    choicesContainer.appendChild(option);
  }

  checkFuncs.push(() => {
    let selected = document.querySelector("#"+name).value;

    if (selected === correctAnswer) {
      rightAnswer(num);
    } else {
      wrongAnswer(num);
    }
  });

}

function displayRadioChoices(num,containerId,choicesArray, correctAnswer) {
  shuffleArray(choicesArray);

  let name="q"+num;

  let choicesContainer = document.querySelector(containerId);
  choicesContainer.textContent = "";

  for (let choice of choicesArray) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.id = choice;
    input.value = choice;

    let label = document.createElement("label");
    label.htmlFor = choice;
    label.textContent = choice;

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(document.createTextNode(" "));
  }

  checkFuncs.push(() => {
    let selected = document.querySelector("input[name="+name+"]:checked");

    if (selected !== null && selected.value === correctAnswer) {
      rightAnswer(num);
    } else {
      wrongAnswer(num);
    }
  });
}

function displayQ1() {
  displayTextQuestion(1, "sacramento");
}

function displayQ2Choices() {
  let choices = [
    ["ms", "Mississippi"], 
    ["mo", "Missouri"], 
    ["co", "Colorado"], 
    ["de", "Delaware"]
  ];
  displayDropdownChoices(2, "#q2", choices, "mo");
}

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];

  displayRadioChoices(4, "#q4Choices", q4ChoicesArray, "Rhode Island");
}
function displayQ5Choices() {
  let q5ChoicesArray = ["California", "Texas", "Alaska", "Florida"];

  displayRadioChoices(5, "#q5Choices", q5ChoicesArray, "California");
}
function displayQ6Choices() {
  let q6ChoicesArray = ["North Dakota", "Rhode Island", "Wyoming", "Alaska"];

  displayRadioChoices(6, "#q6Choices", q6ChoicesArray, "Wyoming");
}

function displayQ7Choices() {
  displayDropdownChoices(7, "#q7", [
    ["dv", "Death Valley"],
    ["lb", "Long Beach"],
    ["ys", "Yosemite Valley"],
    ["kw", "Key West"]
  ], "dv");
}

function displayQ8Choices() {
  displayRadioChoices(8, "#q8Choices", ["Colorado", "Mississippi", "Yukon", "Rio Grande"], "Colorado");
}

function displayQ9() {
  displayTextQuestion(9, "washington");
}


function displayQ10Choices() {
  displayDropdownChoices(10, "#q10", [
    ["4", "4"],
    ["6", "6"],
    ["11", "11"],
    ["15", "15"],
  ], "11");
}
