var currentQuestionIndex = 0;
var retryUsed = false;
var quizData =[];// will come from localStorage
var correctSound;
var wrongSound;
var ansCorrect = false;

// load sounds using p5.js
function preload(){
    correctSound = loadSound('assets/correct.wav');
    correctSound.setVolume(0.3);
    wrongSound = loadSound('assets/wrong.wav');
    wrongSound.setVolume(0.3);
}

// restart button
var restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", restartGame)

// load questions from localStorage
window.addEventListener('load', () => {
    const storedQuestions = localStorage.getItem('quizQuestions');
    if (storedQuestions){
        quizData = JSON.parse(storedQuestions);
    }
    else{
        alert("No quiz questions found. Please upload PDF file first.")
        window.location.href = "index.html" // redirect if no questions
    }

    loadQuestion();
});

// load the current question into the UI
function loadQuestion() {
    var questionEl = document.querySelector(".questions")
    var answerBtns = document.querySelectorAll(".answers button");

    var current = quizData[currentQuestionIndex];
    questionEl.textContent = current.question;

    answerBtns.forEach((btn, index) => {
        btn.textContent = current.options[index]; // options from JSON
        btn.disabled = false;
        btn.style.backgroundColor = "";

        btn.onclick = () => {
            checkAnswer(btn.textContent, current.answer, btn);
        }
    });

    // reset bubble text
    document.querySelector(".quote").textContent = "Keep it up!";
    retryUsed = false;
}

// check selected answer
function checkAnswer(selected, correct,button){
    var bubble = document.querySelector(".quote");
    
    if(selected == correct){

        ansCorrect = false;
        movingChar = true;
        bubble.textContent = "Correct!"
        button.style.backgroundColor = "green"
        correctSound.play();
        

        setTimeout(() => {
            currentQuestionIndex ++
            retryUsed = false;
            if(currentQuestionIndex < quizData.length)
            {
                loadQuestion();
            }
            else
            {
                bubble.textContent = "Well Done! Finished all Qs";
                disableAnswerButtons();
            }

        },700);

       
    }
    else {
        ansCorrect = false;
        button.style.backgroundColor = "red"
        wrongSound.play();

        if(!retryUsed) {
            bubble.textContent = "Try again!";
            retryUsed = true;
        } else {
            bubble.textContent = "Come back later!"
            disableAnswerButtons();
        }

        setTimeout(() => {
            button.style.backgroundColor = "";
            if(ansCorrect === false && !retryUsed) {
                bubble.textContent = "Keep It Up!";
            }
        }, 1000);

    }
}

// disable all answer buttons
function disableAnswerButtons() {
    document.querySelectorAll(".answers button").forEach(btn => {
        btn.disabled = true;
    })
    
}

// restart the quiz
function restartGame() {
    currentQuestionIndex = 0;
    retryUsed = false;
    ansCorrect = false;
    Mark = 0;
    coinCollected = false;
    
    var bubble = document.querySelector(".quote");
    bubble.textContent = "Keep It Up!"
    
    document.querySelectorAll(".answers button").forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "";
    });

    resetCharacter();
    loadQuestion();
}