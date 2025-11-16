var currentQuestionIndex = 0;
var retryUsed = false;
var quizData = []; // will come from localStorage
var correctSound;
var wrongSound;
var ansCorrect = false;

// load sounds using p5.js
function preload() {
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
    if (storedQuestions) {
        quizData = JSON.parse(storedQuestions);
    }
    else {
        alert("No quiz questions found. Please upload PDF file first.")
        window.location.href = "index.html"; // redirect if no questions
    }

    loadQuestion();
});

async function generatePDF() {
    if (!quizData || quizData.length === 0) {
        alert("No quiz data available!");
        return;
    }

    const pdf = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Load background image
    const bgImg = await loadImageAsBase64("assets/pdfBackground.jpg");
    pdf.addImage(bgImg, "PNG", 0, 0, pageWidth, pageHeight);

    // Padding & text positioning
    let y = 100;
    const x = 60;

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(40, 40, 40);
    pdf.text("Quiz Summary", x, y);
    y += 40;

    // Print questions with styled boxes
    pdf.setFontSize(14);
    pdf.setFont("courier", "bolditalic");

    let textWidth = 460;
    quizData.forEach((q, i) => {
        // Choose a pastel colour for each box
        const pastelColors = [
            [255, 240, 245], // light pink
            [240, 255, 240], // light green
            [240, 248, 255], // light blue
            [255, 250, 205], // light yellow
            [255, 235, 205]  // light peach
        ];

        const fillColor = pastelColors[i % pastelColors.length];

        // Question box
        pdf.setFillColor(...fillColor);
        pdf.roundedRect(x - 10, y - 14, 480, 55, 6, 6, "F");

        // Wrap question
        pdf.setFont("courier", "bold");
        pdf.setFontSize(12);

        let qLines = pdf.splitTextToSize(`Q${i + 1}: ${q.question}`, textWidth);

        // Max number of lines that fit in 55px height
        const maxLines = 3;
        if (qLines.length > maxLines) {
            qLines = qLines.slice(0, maxLines);
            qLines[maxLines - 1] += "…";
        }

        pdf.text(qLines, x, y);

        // Wrap answer
        let answerY = y + 55 // Answer below the box
        let aLines = pdf.splitTextToSize(`Ans: ${q.answer}`, textWidth);

        if (aLines.length > maxLines) {
            aLines = aLines.slice(0, maxLines);
            aLines[maxLines - 1] += "…";
        }

        pdf.text(aLines, x, answerY);

        // Move down fixed amount
        y = answerY + 40;

        // New Page if needed
        if (y > pageHeight - 80) {
            pdf.addPage();
            pdf.addImage(bgImg, "JPG", 0, 0, pageWidth, pageHeight);
            y = 80;
        }
    });

    pdf.save("quiz_results.pdf");
}

// Helper function to load images
function loadImageAsBase64(url) {
    return new Promise(resolve => {
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.src = url;
    });
}

// Helper function to wrap text
function wrapText(pdf, text, x, y, maxWidth, lineHeight) {
    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line, index) => {
        pdf.text(line, x, y + index * lineHeight);
    });
    return lines.length * lineHeight; // total height used
}

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
function checkAnswer(selected, correct, button) {
    var bubble = document.querySelector(".quote");

    if (selected == correct) {

        ansCorrect = false;
        movingChar = true;
        bubble.textContent = "Correct!"
        button.style.backgroundColor = "green"
        correctSound.play();


        setTimeout(() => {
            currentQuestionIndex++
            retryUsed = false;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            }
            else {
                bubble.textContent = "Well Done! Finished all Qs";
                disableAnswerButtons();
                generatePDF();
            }

        }, 700);

    }
    else {
        ansCorrect = false;
        button.style.backgroundColor = "red"
        wrongSound.play();

        if (!retryUsed) {
            bubble.textContent = "Try again!";
            retryUsed = true;
        } else {
            bubble.textContent = "Come back later!"
            disableAnswerButtons();
        }

        setTimeout(() => {
            button.style.backgroundColor = "";
            if (ansCorrect === false && !retryUsed) {
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
