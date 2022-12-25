//comment

let timer = document.querySelector(".timer"),
  question = document.querySelector(".question h2"),
  answers = document.querySelector(".answers"),
  scoreContainer = document.querySelector(".score"),
  counter = document.querySelector(".counter"),
  main = document.querySelector("main"),
  gameButton = document.querySelector("#start"),
  scoreButton = document.querySelector("#score"),
  loader = document.querySelector(".loader"),
  container = document.querySelector(".container");

let score = 0,
  correntQuestion = 1,
  timeLeft = 15,
  time;
let myHeaders = new Headers();
myHeaders.append("X-Api-Key", "YOUR-API-KEY");
var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};
let quiz;

function start() {
  fetch("https://quizapi.io/api/v1/questions?tags=JavaScript", requestOptions)
    .then((response) => response.text())
    .then((result) => (quiz = JSON.parse(result)))
    .catch((error) => console.log("error", error))
    .then(() => {
      startApp(quiz);
    });
}

function startApp(quiz) {
  correntQuestion = 1;
  loader.classList.add("hidden");
  container.classList.add("hidden");
  main.classList.remove("hidden");
  loadQuestion(quiz);
}

function startTime() {
  let i = timeLeft * 10;
  time = setInterval(() => {
    timer.style.background = `conic-gradient(#ffc700 ${
      (i / (timeLeft * 10)) * 100
    }%, #212121 ${(i / (timeLeft * 10)) * 100}%)`;
    timer.firstChild.innerHTML = Math.ceil(i / 10);
    if (i == 0) {
      clearInterval(time);
      correntQuestion++;
      loadQuestion(quiz);
    }
    i--;
  }, 100);
}

function loadQuestion(quiz) {
  if (correntQuestion > quiz.length) {
    main.classList.add("hidden");
    container.classList.remove("hidden");
    container.innerHTML = `<h1>Game Over</h1><h2>score : ${score}</h2>`;
    gameButton.innerHTML = "continue playing";
    container.appendChild(gameButton);
  } else {
    counter.innerText = `${correntQuestion}/${quiz.length}`;
    question.innerText = quiz[correntQuestion - 1].question;
    let ans = Object.values(quiz[correntQuestion - 1].answers);
    for (let q = 0; q < ans.length; q++) {
      if (ans[q]) {
        answers.children[q].innerText = ans[q];
      }
    }
    startTime();
  }
}

let r;
answers.addEventListener("click", (i) => {
  let rightAnswer = Object.values(quiz[correntQuestion - 1].correct_answers);

  for (let a = 0; a < rightAnswer.length; a++) {
    if (rightAnswer[a] == "true") {
      if (i.target.innerText == answers.children[a].textContent) {
        score++;
        scoreContainer.innerText = `score : ${score} `;
      }
      r = a;
    }
  }
  correntQuestion++;
  clearInterval(time);
  loadQuestion(quiz);
});

scoreButton.addEventListener("click", () => {
  scoreButton.parentElement.classList.add("hidden");
  container.classList.remove("hidden");
  container.innerHTML = `<h1>Game Over</h1><h2>score : ${score}</h2>`;
  container.appendChild(gameButton);
});

gameButton.addEventListener("click", () => {
  gameButton.parentElement.classList.add("hidden");
  loader.classList.remove("hidden");
  start();
  console.log("start clicked");
});
