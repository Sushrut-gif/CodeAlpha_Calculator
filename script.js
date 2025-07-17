const display = document.getElementById("display");
let current = "";

function updateDisplay() {
  display.textContent = current || "0";
}

// Simple safe arithmetic evaluator (supports + - * / and decimals)
function safeEvaluate(expr) {
  // Only allow valid characters (digits, ., +, -, *, /, parentheses, whitespace)
  if (!/^[\d+\-*/().\s]+$/.test(expr)) return "Error";
  try {
    // Use Function constructor to create a safe evaluator
    // Note: No variables/functions, just arithmetic
    // This is much safer than eval, but still not 100% secure for all non-standard inputs
    // For full safety, use a math parser library like math.js
    // Here, for basic calculator, this is sufficient
    // Remove whitespace
    expr = expr.replace(/\s+/g, "");
    // Prevent consecutive operators (e.g., 2++2)
    if (/[\+\-\*\/]{2,}/.test(expr)) return "Error";
    // Prevent leading operators (except minus)
    if (/^[\+\*\/]/.test(expr)) return "Error";
    // Prevent trailing operators
    if (/[\+\-\*\/]$/.test(expr)) return "Error";
    // Evaluate safely
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + expr + ")")().toString();
  } catch {
    return "Error";
  }
}

function evaluateExpression() {
  current = safeEvaluate(current);
  updateDisplay();
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (value === "C") {
      current = "";
    } else if (value === "=") {
      evaluateExpression();
      return;
    } else if (value === "←") {
      current = current.slice(0, -1);
    } else {
      current += value;
    }
    updateDisplay();
  });
});

// Bonus: Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/[\d.+\-*/]/.test(key)) {
    current += key;
    updateDisplay();
  } else if (key === "Enter") {
    evaluateExpression();
  } else if (key === "Backspace") {
    current = current.slice(0, -1);
    updateDisplay();
  } else if (key === "Escape") {
    current = "";
    updateDisplay();
  }
});
