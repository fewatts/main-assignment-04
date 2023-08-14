/**
 * Get the display element.
 * @type {HTMLElement}
 */
const display = document.getElementById("display");

/**
 * Get all buttons with the "btn" class.
 * @type {NodeList}
 */
const buttons = document.querySelectorAll(".btn");

/**
 * Perform arithmetic calculations based on given numbers and an operator.
 * @param {number} num1 - The first number.
 * @param {string} operator - The arithmetic operator (+, -, *, /, %).
 * @param {number} num2 - The second number.
 * @returns {string} The formatted result of the arithmetic operation with up to 2 decimal places if necessary,
 *          or an error message if invalid.
 */
const calculate = (num1, operator, num2) =>
   formatResult(performCalculation(num1, operator, num2));

/**
 * Perform the actual arithmetic calculation based on given numbers and an operator.
 * @param {number} num1 - The first number.
 * @param {string} operator - The arithmetic operator (+, -, *, /).
 * @param {number} num2 - The second number.
 * @returns {number} The unformatted result of the arithmetic operation.
 */
const performCalculation = (num1, operator, num2) => {
   switch (operator) {
      case "+":
         return num1 + num2;
      case "-":
         return num1 - num2;
      case "/":
         return num2 === 0 ? "Error." : num1 / num2;
      case "*":
         return num1 * num2;
      case "%":
         return num1 / 100;
      default:
         return "Error.";
   }
};

/**
 * Format the calculation result, removing decimal places if they're zero.
 * @param {number} result - The unformatted result of the arithmetic operation.
 * @returns {string} The formatted result with up to 2 decimal places if necessary.
 */
const formatResult = (result) => {
   if (typeof result === "string") {
      return result;
   }
   const formattedResult = parseFloat(result).toFixed(2);
   const [integerPart, decimalPart] = formattedResult.split(".");
   return parseInt(decimalPart) === 0 ? integerPart : formattedResult;
};

/**
 * Handle button click events and update the calculator display.
 * @param {string} input - The input received from the clicked button.
 */
const handleButtonClick = (input) => {
   if (input === "=") {
      display.textContent = calculateFromString(display.textContent);
   } else if (input === "C") {
      display.textContent = "0";
   } else if (display.textContent === "0" || display.textContent === "Error.") {
      display.textContent = input;
   } else if (["+", "-", "*", "/", "%"].includes(input)) {
      const lastChar = display.textContent.slice(-1);
      const inputWithoutOperator = display.textContent;
      if (!isNaN(lastChar)) {
         display.textContent =
            calculateFromString(inputWithoutOperator) + ` ${input} `;
      } else {
         display.textContent = inputWithoutOperator.slice(0, -2) + ` ${input} `;
      }
   } else if (input === "←") {
      if (display.textContent !== "0") {
         handleBackspace();
      }
   } else if (input === ".") {
      handleDecimalInput();
   } else {
      display.textContent += input;
   }
};

/**
 * Calculate a result based on a string input in the valid format.
 * @param {string} input - The input string in the valid format: "num1 operator num2".
 * @returns {string} The formatted result of the calculation, showing two decimal places if needed,
 *          or an error message if the input is invalid.
 */
const calculateFromString = (input) => {
   const expressions = input.split(" ");
   let result = parseFloat(expressions[0]);
   for (let i = 1; i < expressions.length; i += 2) {
      const operator = expressions[i];
      const num2 = parseFloat(expressions[i + 1]);
      result = calculate(result, operator, num2);
   }
   return isNaN(result) ? "Error." : result;
};

/**
 * Handle decimal point input.
 */
const handleDecimalInput = () => {
   const currentContent = display.textContent;
   const lastChar = currentContent.slice(-1);
   if (
      !currentContent.includes(".") &&
      (!isNaN(lastChar) || lastChar === ".")
   ) {
      display.textContent += ".";
   }
};

/**
 * Handle keyboard input events.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const handleKeyboardInput = (event) => {
   const key = event.key;
   if (key === "Enter") {
      handleButtonClick("=");
   } else if (key === "Escape") {
      handleButtonClick("C");
   } else if (/[0-9]/.test(key) || /[\+\-\*/%]/.test(key) || key === ".") {
      handleButtonClick(key);
   } else if (key === "Backspace") {
      if (display.textContent !== "0") {
         handleButtonClick("←");
      }
   }
};

// Add event listener for keyboard input
document.addEventListener("keydown", handleKeyboardInput);

/**
 * Handle backspace input.
 */
const handleBackspace = () => {
   const currentContent = display.textContent;
   const newContent = currentContent.slice(0, -1) || "0";
   display.textContent = newContent;
};

// Add event listener for buttons
buttons.forEach((button) => {
   button.addEventListener("click", () => {
      handleButtonClick(button.textContent);
   });
});
