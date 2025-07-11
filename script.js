let input = "";
let history = [];
let openBrackets = 0;
let memory = 0;


const inputDisplay = document.getElementById("input");
const preview = document.getElementById("preview");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");

function append(value) {
  const isDigit = /[0-9]/.test(value);

  if (isDigit) {
    // Get last number from input (split by operator)
    const parts = input.split(/[\+\-\*\/\%\(\)]/);
    const lastNumber = parts[parts.length - 1];

    if (lastNumber && lastNumber.length >= 15) return; // max 15 digits per number
  }

  if (input === "0") input = "";
  input += value;
  inputDisplay.innerText = input;
  updatePreview();
}



function clearInput() {
  input = "";
  openBrackets = 0;
  inputDisplay.innerText = "0";
  preview.innerText = "0";
}

function backspace() {
  const lastChar = input.slice(-1);
  if (lastChar === "(") openBrackets--;
  if (lastChar === ")") openBrackets++;
  input = input.slice(0, -1);
  inputDisplay.innerText = input || "0";
  updatePreview();
}

function sanitizeExpression(expr) {
  return expr
    .replace(/\+\++/g, "+")
    .replace(/--+/g, "+")
    .replace(/\+-+/g, "-")
    .replace(/-\++/g, "-")
    .replace(/(?<!\()([\+\-\*\/]){2,}/g, match => match.slice(-1));
}

function updatePreview() {
  try {
    if (input.trim() === "") {
      preview.innerText = "0";
    } else {
      const result = eval(sanitizeExpression(input));
      preview.innerText = result;
    }
  } catch {
    preview.innerText = "...";
  }
}

function calculate() {
  try {
    // Auto-close unclosed brackets
    for (let i = 0; i < openBrackets; i++) {
      input += ")";
    }
    openBrackets = 0;

    const cleanInput = sanitizeExpression(input);
    const result = eval(cleanInput);
    history.unshift(`${cleanInput} = ${result}`);
    if (history.length > 5) history.pop();
    input = result.toString();
    inputDisplay.innerText = input;
    preview.innerText = result;
  } catch {
    preview.innerText = "Error";
  }
}

function showHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No History</li>";
  } else {
    history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      historyList.appendChild(li);
    });
  }
  historyBox.style.display = historyBox.style.display === "none" ? "block" : "none";
}

function toggleBracket() {
  if (openBrackets <= 0) {
    input += "(";
    openBrackets++;
  } else {
    input += ")";
    openBrackets--;
  }
  inputDisplay.innerText = input;
  updatePreview();
}

function memoryAdd() {
  memory += eval(sanitizeExpression(input));
}

function memorySubtract() {
  memory -= eval(sanitizeExpression(input));
}

function memoryRecall() {
  append(memory.toString());
}

function memoryClear() {
  memory = 0;
}


// Keyboard input support
document.addEventListener("keydown", function (e) {
  const keys = "0123456789+-*/.%()";
  if (keys.includes(e.key)) {
    append(e.key);
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearInput();
  }
});
// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}

