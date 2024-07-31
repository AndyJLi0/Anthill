import { expect } from 'chai';
import { testCases, runTestCases, databaseLog } from '../index.js';
import { doc, getFirestore, getDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmxHi0ePlXnK-R9mshM_f6f6uL_9ZB0Lw",
  authDomain: "anthill-976f5.firebaseapp.com",
  projectId: "anthill-976f5",
  storageBucket: "anthill-976f5.appspot.com",
  messagingSenderId: "404854557178",
  appId: "1:404854557178:web:ba19d53bbac68de0773c43",
  measurementId: "G-HX6JM48RCP"
};
// Initialize Firebase
const app_firebase = initializeApp(firebaseConfig);

const auth = getAuth(app_firebase);

console.log("before db init");
// Initialize Firestore
const db = getFirestore(app_firebase);


// the tests for testCases can be seen more verbosely described in
// the snippet-tests/test directory
describe('testCases function tested against correct snippets', () => {
  it('testCases 1 against correct snippet 1', () => {
    const cases = testCases[1];

    function foo(a, b) {
      return a + b;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 2 against correct snippet 2', () => {
    const cases = testCases[2];

    function foo(a, b) {
      if (a > b) {
          return a;
      } else {
          return b;
      }
    } 

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 3 against correct snippet 3', () => {
    const cases = testCases[3];

    function foo(x, y) {
        for (let i = 0; i < x; i++) {
            y = y + ".";
            
        }
        return y;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 4 against correct snippet 4', () => {
    const cases = testCases[4];

    function foo(a, b) {
      if (b % 2 == 0 && a % 2 == 0) {
          return true;
      } else {
          return false;
      }
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 5 against correct snippet 5', () => {
    const cases = testCases[5];

    function foo(a) {
      let x = 0;
      for (let i = 1; i <= a; i++) {
          x += i;
      }
      return x;
    } 

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 6 against correct snippet 6', () => {
    const cases = testCases[6];

    function foo(x) {
      for (let i = 1; i < x; i++) {
        if (x % i == 0 && i != 1) 
          return i;
        
      }
      return 0;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
      expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 7 against correct snippet 7', () => {
    const cases = testCases[7];

    function foo(a, b) {
      let bar = 1;
      if (a < b) {
          for (let x = 1; x <= a; x++) {
              bar *= x;
          }
      } else {
          for (let x = 1; x <= b; x++) {
              bar *= x;
          }
      }
      return bar;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
      expect(testCase.expected).to.equal(result);
    }
  });

  it('testCases 8 against correct snippet 8', () => {
    const cases = testCases[8];

    function foo(b) {
      let bar = [];
      for (let i = 2; i < b; i++) {
              bar.push(i);
              if (i != 1) {
                  for (let j = 1; j < i; j++) {
                      if (i % j == 0 && j != 1) {
                          bar.pop();
                          j = i;
                      }
                  }
              }
          }
      return bar;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
      expect(testCase.expected).to.have.members(result);
    }
  });
});

// given the above cases are correct, we can test runTestCases
// otherwise these tests are meaningless
// note: tests BACKWARDS from testCases, NOT redundant with above tests
describe('runTestCases tests correct functions', () => {
  it('snippet 1 correctly', () => {
    function foo(a, b) {
      return a + b;
    }

    let result = runTestCases(foo, testCases[1]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 2 correctly', () => {
    function foo(a, b) {
      if (a > b) {
          return a;
      } else {
          return b;
      }
    } 

    let result = runTestCases(foo, testCases[2]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 3 correctly', () => {
    function foo(x, y) {
      for (let i = 0; i < x; i++) {
          y = y + ".";
          
      }
      return y;
    }

    let result = runTestCases(foo, testCases[3]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 4 correctly', () => {
    function foo(a, b) {
      if (b % 2 == 0 && a % 2 == 0) {
          return true;
      } else {
          return false;
      }
    }

    let result = runTestCases(foo, testCases[4]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 5 correctly', () => {
    function foo(a) {
      let x = 0;
      for (let i = 1; i <= a; i++) {
          x += i;
      }
      return x;
    } 

    const result = runTestCases(foo, testCases[5]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 6 correctly', () => {

    function foo(x) {
      for (let i = 1; i < x; i++) {
        if (x % i == 0 && i != 1) 
          return i;
        
      }
      return 0;
    }

    let result = runTestCases(foo, testCases[6]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 7 correctly', () => {

    function foo(a, b) {
      let bar = 1;
      if (a < b) {
          for (let x = 1; x <= a; x++) {
              bar *= x;
          }
      } else {
          for (let x = 1; x <= b; x++) {
              bar *= x;
          }
      }
      return bar;
    }

    let result = runTestCases(foo, testCases[7]);
    expect(result.passed).to.equal(result.total);
  });

  it('snippet 8 correctly', () => {

    function foo(b) {
      let bar = [];
      for (let i = 2; i < b; i++) {
              bar.push(i);
              if (i != 1) {
                  for (let j = 1; j < i; j++) {
                      if (i % j == 0 && j != 1) {
                          bar.pop();
                          j = i;
                      }
                  }
              }
          }
      return bar;
    }

    let result = runTestCases(foo, testCases[8]);
    expect(result.passed).to.equal(result.total);
  });
});

// these tests are slight mutations on the above, such that we can test
// for cases where functions are wrong. Note that these do not represent
// complete sets of mutations, which would be more desirable.
describe('runTestCases tests incorrect functions', () => {
  it('snippet 1 incorrectly', () => {
    function foo(a, b) {
      return a * b;
    }

    let result = runTestCases(foo, testCases[1]);
    
    
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 3);
  });

  it('snippet 2 incorrectly', () => {
    function foo(a, b) {
      if (a < b) {
          return a;
      } else {
          return b;
      }
    } 

    let result = runTestCases(foo, testCases[2]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 6);
  });

  it('snippet 3 incorrectly', () => {
    function foo(x, y) {
      for (let i = 3; i < x; i++) {
          y = y + ".";
          
      }
      return y;
    }

    let result = runTestCases(foo, testCases[3]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 2);
  });

  it('snippet 4 incorrectly', () => {
    function foo(a, b) {
      if (b % 2 == 1 && a % 2 == 0) {
          return true;
      } else {
          return false;
      }
    }

    let result = runTestCases(foo, testCases[4]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 2);
  });

  it('snippet 5 incorrectly', () => {
    function foo(a) {
      let x = 0;
      for (let i = 1; i <= a; i++) {
          x *= i;
      }
      return x;
    } 

    const result = runTestCases(foo, testCases[5]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 3);
  });

  it('snippet 6 incorrectly', () => {

    function foo(x) {
      for (let i = 1; i < x; i++) {
        if (x % i == 0 && i != 1) 
          return i;
        
      }
      return 0;
    }

    let result = runTestCases(foo, testCases[6]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total);
  });

  it('snippet 7 incorrectly', () => {

    function foo(a, b) {
      let bar = 1;
      if (a < b) {
          for (let x = 1; x <= a; x++) {
              bar -= x;
          }
      } else {
          for (let x = 1; x <= b; x++) {
              bar -= x;
          }
      }
      return bar;
    }

    let result = runTestCases(foo, testCases[7]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 4);
  });

  it('snippet 8 incorrectly', () => {

    function foo(b) {
      let bar = [];
      for (let i = 5; i < b; i++) {
              bar.push(i);
              if (i != 1) {
                  for (let j = 1; j < i; j++) {
                      if (i % j == 0 && j != 1) {
                          bar.pop();
                          j = i;
                      }
                  }
              }
          }
      return [2];
    }

    let result = runTestCases(foo, testCases[8]);
    let result_object = {
      passed: Number(result[1][0]),
      total: Number(result[1][2])
    };
    expect(result_object.passed).to.equal(result_object.total - 5);
  });
});

describe('Logging function test', () => {
  const email = "test_email";
    const prompt = "test_prompt";
    const questionId = 20;
    const functionCode = "test_functionCode";
    const result = { passed: "test", total: "3/4" };

    beforeEach(async () => {
        // Clean up the test document before each test
        await deleteDoc(doc(db, 'users', email));
    });

    it('should log for a new user', async () => {
        await databaseLog(email, prompt, questionId, functionCode, result);

        const userDocRef = doc(db, 'users', email);
        const userDocSnap = await getDoc(userDocRef);
        expect(userDocSnap.exists()).to.be.true;

        const data = userDocSnap.data();
        expect(data.logs).to.be.an('array').that.has.lengthOf(1);
        expect(data.logs[0].prompt).to.equal(prompt);
        expect(data.logs[0].questionId).to.equal(questionId);
        expect(data.logs[0].functionCode).to.equal(functionCode);
        expect(data.logs[0].result.passed).to.equal(result.passed);
        expect(data.logs[0].result.total).to.equal(result.total);
    });

    it('should log for an existing user', async () => {
      await databaseLog(email, prompt, questionId, functionCode, result);

      // Log again with new details
      const newPrompt = "new_test_prompt";
      const newQuestionId = 21;
      const newFunctionCode = "new_test_functionCode";
      const newResult = { passed: "new_test", total: "4/4" };
      await databaseLog(email, newPrompt, newQuestionId, newFunctionCode, newResult);

      const userDocRef = doc(db, 'users', email);
      const userDocSnap = await getDoc(userDocRef);
      expect(userDocSnap.exists()).to.be.true;

      const data = userDocSnap.data();
      expect(data.logs).to.be.an('array').that.has.lengthOf(2);
      expect(data.logs[1].prompt).to.equal(newPrompt);
      expect(data.logs[1].questionId).to.equal(newQuestionId);
      expect(data.logs[1].functionCode).to.equal(newFunctionCode);
      expect(data.logs[1].result.passed).to.equal(newResult.passed);
      expect(data.logs[1].result.total).to.equal(newResult.total);
  });
});

// const response = await ollama.chat({
//   model: 'llama2',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })
// console.log(response.message.content)