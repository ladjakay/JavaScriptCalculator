// script.js
let currentInput = '0';
let formula = '';
let evaluated = false;

const displayEl = document.getElementById('display');
const formulaDisplayEl = document.getElementById('formula-display');

const isOperator = /[+-*/]/;
const endsWithOperator = /[+-*/]$/;
const endsWithNegativeSign = /[+-*/]-$/;

function updateDisplay() {
  displayEl.innerText = currentInput;
  formulaDisplayEl.innerText = formula || '0';
}

function handleClear() {
  currentInput = '0';
  formula = '';
  evaluated = false;
  updateDisplay();
}

function handleNumber(numStr) {
  if (evaluated) {
    currentInput = numStr;
    formula = numStr === '0' ? '' : numStr;
    evaluated = false;
    updateDisplay();
    return;
  }
  if (currentInput === '0' && numStr === '0') return;
  if (currentInput === '0' || isOperator.test(currentInput)) {
    currentInput = numStr;
  } else {
    currentInput += numStr;
  }
  formula += numStr;
  updateDisplay();
}

function handleDecimal() {
  if (evaluated) {
    currentInput = '0.';
    formula = '0.';
    evaluated = false;
    updateDisplay();
    return;
  }
  if (isOperator.test(currentInput)) {
    currentInput = '0.';
    formula += '0.';
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    formula += '.';
    updateDisplay();
  }
}

function handleOperator(op) {
  if (evaluated) {
    formula = currentInput + op;
    currentInput = op;
    evaluated = false;
    updateDisplay();
    return;
  }
  if (formula === '' && op === '-') {
    currentInput = '-';
    formula = '-';
    updateDisplay();
    return;
  }
  if (formula === '') return;

  if (endsWithOperator.test(formula)) {
    if (endsWithNegativeSign.test(formula)) {
      if (op !== '-') {
        formula = formula.slice(0, -2) + op;
      }
    } else {
      if (op === '-') {
        formula += op;
      } else {
        formula = formula.slice(0, -1) + op;
      }
    }
  } else {
    formula += op;
  }

  currentInput = op;
  updateDisplay();
}

function handleEquals() {
  if (evaluated || formula === '') return;
  let expression = formula;
  while (endsWithOperator.test(expression)) {
    expression = expression.slice(0, -1);
  }
  try {
    const result = Function(`'use strict'; return (${expression})`)();
    const formattedResult = String(Math.round(result * 1000000) / 1000000);
    formula = `${expression}=${formattedResult}`;
    currentInput = formattedResult;
    evaluated = true;
    updateDisplay();
  } catch (err) {
    currentInput = 'Error';
    formula = '';
    evaluated = true;
    updateDisplay();
  }
}
