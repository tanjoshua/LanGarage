var nativeLanguage = ""
var languageLearn = ""
document.getElementById("native")

function setNL(countryCode, fullname) {
  nativeLanguage = countryCode;
  document.getElementById("native").innerText = fullname
}

function setLL(countryCode, fullname) {
  languageLearn = countryCode;
  document.getElementById("learn").innerText = fullname
}

const quiz = document.getElementById("container")
const addButton = document.getElementById('add-btn')
const beginButton = document.getElementById('begin-btn')
const selection = document.getElementById('selection')

var words = [];
var word, wordList, translatedList, wrongList;
var cNum = 0;

const projectId = 'nice-tiger-255806';

async function translateText(text, source, target) {
  var endpoint = `https://translation.googleapis.com/language/translate/v2`;
  let res = await new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer <INSERT AUTHORIZATION TOKEN HERE>');
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      }
    };
    xhr.send(JSON.stringify({ 'q': text, 'source': source, 'target': target, 'format': 'text' }));
  });
  return res["data"]["translations"][0]["translatedText"];
}

var input = document.getElementById("myInput");

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    word = document.getElementById("myInput").value

    var node = document.createElement("LI")
    node.setAttribute('id', 'list')
    var textnode = document.createTextNode(word)
    node.appendChild(textnode)
    if (word === "") {
      alert("You must write a word!")
    } else {
      words.push(word)
      document.getElementById("display").appendChild(node)
      document.getElementById("myInput").value = ''
    }
  }
});

addButton.addEventListener('click', () => {
  word = document.getElementById("myInput").value

  var node = document.createElement("LI")
  node.setAttribute('id', 'list')
  var textnode = document.createTextNode(word)
  node.appendChild(textnode)
  if (word === "") {
    alert("You must write a word!")
  } else {
    words.push(word)
    document.getElementById("display").appendChild(node)
    document.getElementById("myInput").value = ''
  }
})

beginButton.addEventListener('click', () => {
  if (words.length < 4) {
    alert("You must have more than 4 words or more!")
  } else if (nativeLanguage === "" || languageLearn === "" || nativeLanguage === languageLearn) {
    alert("Please select your languages!")
  } else {
    selection.classList.add('hide')
    quiz.classList.remove("hide")
    wordList = words.slice();
    wordList = words.slice();

    (async () => {
      let lst = await Promise.all(wordList.map(x => translateText(x, nativeLanguage, languageLearn)))
      translatedList = lst;
      wrongList = wordList.slice(); // list of words that have yet to be correctly identified
      questions = generateQuestions(wrongList);
      startGame()
    })()
  }
})


const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

var questions;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

function generateAnswers(correctWord, otherWords) {
  answers = [];
  for (i = 0; i < 3; i++) {
    ind = getRandomInt(otherWords.length);
    answers.push({ text: otherWords[ind], correct: false });
    otherWords.splice(ind, 1);
  }
  answers.splice(getRandomInt(4), 0, { text: correctWord, correct: true });
  return answers;
};

function generateQuestions(wordsl) {
  var questionList = [];
  var i;
  for (i = 0; i < wordsl.length; i++) {
    w = wordsl[i];
    temp = translatedList.slice();
    temp.splice(wordList.indexOf(w), 1);
    questionList.push({
      question: w,
      answers: generateAnswers(translatedList[i], temp)
    });
  }
  return questionList;
}

let currentQuestionIndex;




nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(questions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
    if (correct) { cNum++ }
  } else {
    if (correct) { cNum++ }
    var score = document.getElementById("score")
    score.innerHTML = "Score: " + cNum + "/" + wordList.length
    score.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}
