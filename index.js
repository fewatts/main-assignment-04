const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

/**
 * Checks if the input string matches the valid format for the calculator.
 *
 * @param {string} input - The input string to be validated.
 * @returns {boolean} Returns true if the input matches the valid format, otherwise false.
 */
const isInputValid = (input) => {
   const regex =
      /^((\d+(\.\d+)?%?)\s*([+\-*%/]\s*(\d+(\.\d+)?%?))*)(?:\s*=\s*)?$/;
   return regex.test(input);
};

/**
 * Performs arithmetic calculations based on given numbers and an operator.
 *
 * @param {number} num1 - The first number.
 * @param {string} operator - The arithmetic operator (+, -, *, /).
 * @param {number} num2 - The second number.
 * @returns {number|string} The result of the arithmetic operation, or an error message if invalid.
 */
const calculate = (num1, operator, num2) => {
   switch (operator) {
      case "+":
         return num1 + num2;
      case "-":
         return num1 - num2;
      case "/":
         if (num2 === 0) {
            return "Error.";
         }
         return num1 / num2;
      case "*":
         return num1 * num2;
      case "%":
         return num1 / 100;
      default:
         return "Invalid option, try again.";
   }
};

/**
 * Handles button click events and updates the calculator display.
 *
 * @param {string} input - The input received from the clicked button.
 */
const handleButtonClick = (input) => {
   if (input === "=") {
      // Perform the calculation using the current input
      const result = calculateFromString(display.textContent);
      display.textContent = result;
   } else if (input === "C") {
      // Handle clear
      display.textContent = "0";
   } else if (display.textContent === "0") {
      // Start a new input
      display.textContent = input;
   } else if (display.textContent === "Error.") {
      // Handle input after an error
      display.textContent = input;
   } else if (["+", "-", "*", "/", "%"].includes(input)) {
      // Store the operator for the next calculation
      display.textContent += ` ${input} `;
   } else if (input === "←") {
      handleBackspace();
   } else if (input === ".") {
      handleDecimalInput();
   } else {
      // Continue the current input
      display.textContent += input;
   }
};

/**
 * Calculates a result based on a string input in the valid format.
 *
 * @param {string} input - The input string in the valid format: "num1 operator num2".
 * @returns {number|string} The calculated result or an error message if the input is invalid.
 */
const calculateFromString = (input) => {
   const expressions = input.split(" ");
   let result = parseFloat(expressions[0]);
   let operator = null;

   for (let i = 1; i < expressions.length; i += 2) {
      operator = expressions[i];
      const num2 = parseFloat(expressions[i + 1]);
      result = calculate(result, operator, num2);
   }

   return result === NaN ? "Error." : result;
};

/**
 * Function to handle decimal point
 */
const handleDecimalInput = () => {
   const currentContent = display.textContent;
   const lastChar = currentContent.slice(-1);
   if (!currentContent.includes(".")) {
      // Only allow adding decimal point if the last character is a number
      if (!isNaN(lastChar) || lastChar === ".") {
         display.textContent += ".";
      }
   }
};

/**
 * Function to handle keyboard input
 */
const handleKeyboardInput = (event) => {
   const key = event.key;
   if (key === "Enter") {
      handleButtonClick("=");
   } else if (key === "Escape") {
      handleButtonClick("C");
   } else if (/[0-9]/.test(key)) {
      handleButtonClick(key);
   } else if (/[\+\-\*/%]/.test(key)) {
      handleButtonClick(key);
   } else if (key === ".") {
      handleButtonClick(".");
   } else if (key === "Backspace") {
      if(display.textContent === "0"){
         return;
      }
      handleButtonClick("←");
   }
};

// Add event listener for keyboard input
document.addEventListener("keydown", handleKeyboardInput);

/**
 * Function to handle backspace
 */
const handleBackspace = () => {
   const currentContent = display.textContent;
   const newContent = currentContent.slice(0, -1);
   console.log(currentContent)
   if (newContent === "") {
      display.textContent = "0";
   } else {
      display.textContent = newContent;
   }
};

// Add event listener for buttons
buttons.forEach((button) => {
   button.addEventListener("click", () => {
      handleButtonClick(button.textContent);
   });
});
