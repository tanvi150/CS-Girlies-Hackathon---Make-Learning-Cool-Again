console.log("CWD:", process.cwd());

require('dotenv').config(); // Loads .env into process.env
console.log("Using API Key:", process.env.OPENROUTER_API_KEY ? "Loaded" : "Missing");

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
console.log('Public folder exists:', fs.existsSync(path.join(__dirname, 'public')));
console.log('Index.html exists:', fs.existsSync(path.join(__dirname, 'public', 'index.html')));

const pdfParse = require('pdf-parse');
console.log('pdfParse type:', typeof pdfParse);

const app = express();
const PORT = 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MAX_FILE_SIZE_MB = 5; // 5MB max per file

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('<h1>Hello from server</h1>');
});

// Multer setup for file uploads
const upload = multer({
    dest: 'uploads',
    limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 } // 5MB}
});

// POST /upload
app.post('/upload', upload.array('files[]'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    try {
        const allQuestions = [];

        for (const file of req.files) {
            const dataBuffer = fs.readFileSync(file.path);
            const pdfData = await pdfParse(dataBuffer);
            const text = pdfData.text

            //Generate questions via OpenRouter
            const prompt = `
                    Generate 10 multiple-choice questions from the following text. 
                    - 3 Easy questions
                    - 3 Medium questions
                    - 3 Hard questions
                    - 1 Think-out-of-the-box/creative question

                    ALL questions must be **directly relevant to the content** in the text.
                    Answers can be inferred from the content — they do not have to appear verbatim.
                    Each question must have EXACTLY 4 options.

                    Format: JSON array with keys: id, question, options (array), answer
                    Text: """${text}"""
                    `;

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await response.json()

            let questionsJSON = [];
            let content = data.choices[0].message.content.trim()

            if (content.startsWith('```')){
                content = content.replace(/```(?:json)?\n?/, '').replace(/```$/, '');
            }

            try{
                questionsJSON = JSON.parse(content)
                console.log("LLM raw response:", data);
                console.log("Questions generated:", questionsJSON); // To see the questions generated in the backend
            } catch(e){
                console.error("LLM returned invalid JSON:", content);
                questionsJSON = [];
            }

            allQuestions.push(...questionsJSON);
        }

        res.json({success: true, questions: allQuestions});
    } catch (err){
        console.error(err);
        res.status(500).json({success: false, message: err.message})
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});