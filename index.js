const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

/**
 * Checks if the input string matches the valid format for the calculator.
 *
 * @param {string} input - The input string to be validated.
 * @returns {boolean} Returns true if the input matches the valid format, otherwise false.
 */

const isInputValid = (input) => {
const regex = /^(\d+(\.\d+)?)(?:\s*([+\-*/])\s*(\d+(\.\d+)?))(?:\s*=\s*)?$/;
return regex.test(input);
};

/**
 * Performs arithmetic calculations based on given numbers and an operator.
 *
 * @param {number} num1 - The first number.
 * @param {string} operator - The arithmetic operator (+, -, *, /, %).
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
          if (num2 === 0) {
             return "Error.";
          }
          return num1 % num2;
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
    if (display.textContent === "Invalid input format.") {
      display.textContent = input;
      input = input === "0" ? "" : input;
    } else if (
      display.textContent === "0" ||
      display.textContent === "Division by zero!"
    ) {
      display.textContent = input;
      input = input === "0" ? "" : input;
    } else if (input === "C") {
      display.textContent = "0";
      input = "";
    } else if (input === "=") {
      const result = calculateFromString(display.textContent);
      display.textContent = result;
      input = result.toString();
    } else if (input === "←") {
        handleBackspace();
    } else if (input === ".") {
        handleDecimalInput();
    } else {
      display.textContent += input;
      input += input;
   }
};

/**
 * Calculates a result based on a string input in the valid format.
 *
 * @param {string} input - The input string in the valid format: "num1 operator num2".
 * @returns {number|string} The calculated result or an error message if the input is invalid.
 */
const calculateFromString = (input) => {
    if (isInputValid(input)) {
       const regex = /^(\d+(\.\d+)?)(?:\s*([+\-*/])\s*(\d+(\.\d+)?))(?:\s*=\s*)?$/;
       const match = input.match(regex);
       const num1 = parseFloat(match[1]);
       const operator = match[3];
       const num2 = parseFloat(match[4]);
       return calculate(num1, operator, num2);
    } else {
       return "Error.";
    }
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
        handleButtonClick("←");
    }
};

// Add event listener for keyboard input
document.addEventListener("keydown", handleKeyboardInput);

/**
 * Function to handle backspace
 */
const handleBackspace = () => {
    display.textContent = display.textContent.slice(0, -1);
};

/**
 * Function to handle modulus operation
 */
const handleModulus = () => {
    const currentContent = display.textContent;
    const parts = currentContent.split("%");

    if (parts.length === 2) {
        const num1 = parseFloat(parts[0]);
        const num2 = parseFloat(parts[1]);

        if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
            const result = calculate(num1, "%", num2);
            display.textContent = result.toString();
        } else {
            display.textContent = "Invalid input";
        }
    } else {
        display.textContent = "Invalid input";
    }
};

// Add event listener for buttons
buttons.forEach((button) => {
   button.addEventListener("click", () => {
      handleButtonClick(button.textContent);
   });
});
