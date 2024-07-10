import ollama from 'ollama'
import { expect } from 'chai';
import { testCases, runTestCases, pullModel } from '../index.js';


// the tests for testCases can be seen more verbosely described in
// the snippet-tests/test directory
describe('testCases function', () => {
  it('snippet testCases 1 against correct snippet 1', () => {
    const cases = testCases[1];

    function foo(a, b) {
      return a + b;
    }

    for (const testCase of cases) {
      const result = foo(...testCase.input);
        expect(testCase.expected).to.equal(result);
    }
  });

  it('snippet testCases 2 against correct snippet 2', () => {
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

  it('snippet testCases 3 against correct snippet 3', () => {
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

  it('snippet testCases 4 against correct snippet 4', () => {
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

  it('snippet testCases 5 against correct snippet 5', () => {
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

  it('snippet testCases 6 against correct snippet 6', () => {
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

  it('snippet testCases 7 against correct snippet 7', () => {
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

  it('snippet testCases 8 against correct snippet 8', () => {
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

// const response = await ollama.chat({
//   model: 'llama2',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })
// console.log(response.message.content)