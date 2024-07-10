import express from 'express';
import ollama from 'ollama';
import cors from 'cors';


const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Function to pull the model
async function pullModel(modelName) {
    try {
        console.log(`Pulling model: ${modelName}`);
        await ollama.pull({ model: modelName });
        console.log(`Model ${modelName} pulled successfully`);
    } catch (error) {
        console.error(`Error pulling model ${modelName}:`, error);
    }
}

// Define test cases for each question
const testCases = {
    1: [
        { input: [1, 2], expected: 3 },
        { input: [5, 5], expected: 10 },
    ],
    2: [
        { input: [2, 3], expected: 3 },
        { input: [21, 10], expected: 21 },
    ],
    // Add test cases for questions 3-8 similarly
};

// Function to run the code and check against test cases
function runTestCases(func, cases) {
    let passed = 0;
    const total = cases.length;

    for (const testCase of cases) {
        const result = func(...testCase.input);
        console.log(`Running test case: input=${testCase.input}, expected=${testCase.expected}, got=${result}`);
        if (result === testCase.expected) {
            passed += 1;
        }
    }

    return { passed, total };
}

app.post('/attempt/:questionId', async (req, res) => {
    const { prompt } = req.body;
    const { questionId } = req.params;
    console.log('Received prompt:', prompt);
    console.log('Question ID:', questionId);

    const modelName = 'deepseek-coder';
    const fullPrompt = `${prompt} Write this function in JavaScript. This will be directly passed into test cases, so I only want the string of code, in triple backticks, without any explanation or anything. It will be passed into the argument of a Function constructor. I also don't want any /n. No prefixes or suffixes, just the code. All on one line`;

    try {
        // Pull the model if it's not already available
        await pullModel(modelName);

        const response = await ollama.chat({
            model: modelName,
            messages: [{ role: 'user', content: fullPrompt }]
        });

        console.log('Response from ollama:', response);

        // Extract function code from response and remove triple backticks
        let functionCode = response.message.content.trim();
        if (functionCode.startsWith('```javascript') && functionCode.endsWith('```')) {
            functionCode = functionCode.substring(13, functionCode.length - 3).trim();
        }

        console.log('Extracted function code:', functionCode);

        // Create the function
        const userFunction = new Function('return ' + functionCode)();
        console.log('Generated function:', userFunction);

        // Get the relevant test cases
        const cases = testCases[questionId];
        if (!cases) {
            const errorMessage = `No test cases defined for question ${questionId}`;
            console.error(errorMessage);
            res.status(400).send(errorMessage);
            return;
        }

        // Run the test cases
        const result = runTestCases(userFunction, cases);
        const responseMessage = `${result.passed}/${result.total} test cases passed`;
        console.log(responseMessage);

        res.send(responseMessage);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`Error processing the request: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});