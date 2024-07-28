import express from 'express';
import { Ollama } from 'ollama'
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from '../shared/FirebaseConfig.js';
import { doc, collection } from 'firebase/firestore';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const firebaseConfigPath = path.resolve('../shared/FirebaseConfig.js');
// const { db } = await import(firebaseConfigPath);


const app = express();
const port = 3001;

// thank you https://github.com/FlowiseAI/Flowise/issues/2241
const ollama = new Ollama({ host: 'http://host.docker.internal:11434' })

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

async function databaseLog(email, prompt, questionId, functionCode, result) {
    console.log("attempting to log: 13");
    console.log("email: ", email);
    console.log("prompt: ", prompt);
    console.log("questionId: ", questionId);
    console.log("functionCode: ", functionCode);
    console.log("result: ", result);




    try {
        // Create a reference to the user's document
        console.log("is db undefined? ", db);
        const userDocRef = collection(db, 'users');
        console.log("is userDocRef valid? ", userDocRef);


        // Get the user document
        const userDocSnap = await getDoc(userDocRef);

        // Define the log entry
        const logEntry = {
            prompt: prompt,
            questionId: questionId,
            functionCode: functionCode,
            result: {
            passed: result.passed,
            total: result.total,
            },
            timestamp: new Date(),
    };

    // Update the user document with the new log entry
    // await updateDoc(userDocRef, {
    //     logs: arrayUnion(logEntry),
    // });

    if (userDocSnap.exists()) {
        // If the document exists, update it with the new log entry
        await updateDoc(userDocRef, {
            logs: arrayUnion(logEntry),
        });
        console.log('Log entry added to existing document:', logEntry);
    } else {
        // If the document does not exist, create it with the log entry
        await setDoc(userDocRef, {
            logs: [logEntry],
        }, { merge: true });
        console.log('Log entry added to new document:', logEntry);
    }

    console.log('log entry added:', logEntry);
    } catch (error) {
    console.error('error adding log entry:', error);
    }
}

// Function to pull the model
export async function pullModel(modelName) {
    try {
        console.log(`Pulling model: ${modelName}`);
        await ollama.pull({ model: modelName });
        console.log(`Model ${modelName} pulled successfully`);
    } catch (error) {
        console.error(`Error pulling model ${modelName}:`, error);
    }
}

// Define test cases for each question
export const testCases = {
    1: [
        { input: [0, 0], expected: 0 },
        { input: [5, 0], expected: 5 },
        { input: [0, 9], expected: 9 },
        { input: [3, 7], expected: 10 }
    ],
    2: [
        { input: [0,  0], expected: 0 },
        { input: [11, 5], expected: 11 },
        { input: [2,  9], expected: 9 },
        { input: [4,  4], expected: 4 },
        { input: [-2,  -20], expected: -2 },
        { input: [-37, -5], expected: -5 },
        { input: [-14, -14], expected: -14 },
        { input: [17,  -98], expected: 17 },
        { input: [-3,  11], expected: 11 }
    ],
    3: [
        { input: [0,  ""], expected: "" },
        { input: [20, ""], expected: "...................." },
        { input: [0,  "not an empty string"], expected: "not an empty string" },
        { input: [13,  "add some periods"], expected: "add some periods............." }
    ],
    4: [
        { input: [7, 3], expected: false},
        { input: [1, 18], expected: false},
        { input: [12, 213], expected: false},
        { input: [200, 16], expected: true}
    ],
    5: [
        { input: [0], expected: 0},
        { input: [1], expected: 1},
        { input: [5], expected: 15},
        { input: [29], expected: 435}
    ],
    6: [
        { input: [4], expected: 2},
        { input: [105], expected: 3},
        { input: [709979], expected: 61},
        { input: [0], expected: 0},
        { input: [1], expected: 0},
        { input: [2], expected: 0},
        { input: [7], expected: 0},
        { input: [43133], expected: 0}
    ],
    7: [
        { input: [0, 290], expected: 1},
        { input: [1, 5], expected: 1},
        { input: [10, 2001], expected: 3628800},
        { input: [1, 0], expected: 1},
        { input: [2, 1], expected: 1},
        { input: [9, 8], expected: 40320}
    ],
    8: [
        { input: [0], expected: [] },
        { input: [1], expected: [] },
        { input: [10], expected: [2, 3, 5, 7] },
        { input: [11], expected: [2, 3, 5, 7] },
        { input: [12], expected: [2, 3, 5, 7, 11] }  
    ]

};


// Function to run the code and check against test cases
export function runTestCases(func, cases) {
    let passed = 0;
    const total = cases.length;

    for (const testCase of cases) {
        const result = func(...testCase.input);
        console.log(`Running test case: input=${testCase.input}, expected=${testCase.expected}, got=${result}`);
        if (typeof(result) !== 'object' && result === testCase.expected) {
            passed += 1;
        } else if (typeof(result) === 'object' && testCase.expected.length === result.length){ // arrays
            passed += 1;
            for (let i = 0; i < testCase.expected.length ; i++) {
                if(result[i] !== testCase.expected[i]) {
                    passed -= 1;
                    break;
                }
                    
            }
        }
    }

    return { passed, total };
}

app.post('/question/:questionId', async (req, res) => {
    const { email, prompt } = req.body; // Destructure fields directly from req.body
    const { questionId } = req.params; // Destructure questionId from req.params
    console.log('Received prompt:', prompt);
    console.log('Question ID:', questionId);
    console.log('User email:', email);

    


    const modelName = 'deepseek-coder';
    const fullPrompt = `${prompt} Write this function in JavaScript. This will be directly passed into test cases, so I only want the string of code, in triple backticks, without any explanation or anything. It will be passed into the argument of a Function constructor. I also don't want any /n. Do not add any comments, and no notes or explainations, just the raw code. No prefixes or suffixes, just the code. All on one line`;

    try {
        console.log("here");
        console.log("here2");
        // // Pull the model if it's not already available
        // await pullModel(modelName);

        // const response = await ollama.chat({
        //     model: modelName,
        //     messages: [{ role: 'user', content: fullPrompt }]
        // });

        // console.log('Response from ollama:', response);

        // // Extract function code from response and remove triple backticks
        // let functionCode = response.message.content.trim();
        // if (functionCode.startsWith('```javascript') && functionCode.endsWith('```')) {
        //     functionCode = functionCode.substring(13, functionCode.length - 3).trim();
        // }

        // console.log('Extracted function code:', functionCode);

        // // Create the function
        // //TODO:MAX SURE FUNCTION CODE IS SAFE AND NOT MALICIOUS - andy
        // const userFunction = new Function('return ' + functionCode)();
        // console.log('Generated function:', userFunction);

        // if (typeof(userFunction) !== 'function') {
        //     const errorMessage = 'The generated function is not valid';
        //     console.error(errorMessage);
        //     res.status(400).send(errorMessage);
        //     return;
        // }

        // // Get the relevant test cases
        // const cases = testCases[questionId];
        // if (!cases) {
        //     const errorMessage = `No test cases defined for question ${questionId}`;
        //     console.error(errorMessage);
        //     res.status(400).send(errorMessage);
        //     return;
        // }

        // console.log("before running tests");

        // // Run the test cases
        // const result = runTestCases(userFunction, cases);
        // const responseMessage = `${result.passed}/${result.total} test cases passed`;
        // console.log("before resp mess");
        // console.log(responseMessage);

        const prompt = 'test_prompt';
        const questionId = 'test_questionId';
        const functionCode = 'test_functionCode';
        const test_email = "testEmail@notARealDomain.com";
        const result = "test_result";

        console.log("before log");
        // Log result for email's account
        //TODO: get actual email
        await databaseLog(test_email, prompt, questionId, functionCode, result);
        console.log("after log");
        //TEMP
        const responseMessage = "fake response msg";
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



// TODO:
// try making second config file in server dir
// OR move all logging functions to anthill/src directory