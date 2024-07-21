import ollama from 'ollama'
import { expect } from 'chai';
import { testCases, runTestCases, pullModel } from '../index.js';


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
    expect(result.passed).to.equal(result.total - 3);
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
    expect(result.passed).to.equal(result.total - 6);
  });

  it('snippet 3 incorrectly', () => {
    function foo(x, y) {
      for (let i = 3; i < x; i++) {
          y = y + ".";
          
      }
      return y;
    }

    let result = runTestCases(foo, testCases[3]);
    expect(result.passed).to.equal(result.total - 2);
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
    expect(result.passed).to.equal(result.total - 2);
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
    expect(result.passed).to.equal(result.total - 3);
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
    expect(result.passed).to.equal(result.total);
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
    expect(result.passed).to.equal(result.total - 4);
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
      return bar;
    }

    let result = runTestCases(foo, testCases[8]);
    expect(result.passed).to.equal(result.total - 3);
  });
});

// const response = await ollama.chat({
//   model: 'llama2',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })
// console.log(response.message.content)