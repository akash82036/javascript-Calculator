import React from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

const calcData = [
{ id: "clear", value: "AC" },
{ id: "divide", value: "/" },
{ id: "multiply", value: "x" },
{ id: "seven", value: 7 },
{ id: "eight", value: 8 },
{ id: "nine", value: 9 },
{ id: "subtract", value: "-" },
{ id: "four", value: 4 },
{ id: "five", value: 5 },
{ id: "six", value: 6 },
{ id: "add", value: "+" },
{ id: "one", value: 1 },
{ id: "two", value: 2 },
{ id: "three", value: 3 },
{ id: "equals", value: "=" },
{ id: "zero", value: 0 },
{ id: "decimal", value: "." }];


const operators = ["AC", "/", "x", "+", "-", "="];
const operatorSigns = ["+", "-", "x", "/", "*"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Display = ({ input, output }) => /*#__PURE__*/
React.createElement("div", { className: "output" }, /*#__PURE__*/
React.createElement("span", { className: "result" }, output), /*#__PURE__*/
React.createElement("span", { id: "display", className: "input" },
input));




const Key = ({ keyData: { id, value }, handleInput }) => /*#__PURE__*/
React.createElement("button", { id: id, onClick: () => handleInput(value) },
value);



const Keyboard = ({ handleInput }) => /*#__PURE__*/
React.createElement("div", { className: "keys" },
calcData.map((key) => /*#__PURE__*/
React.createElement(Key, { key: key.id, keyData: key, handleInput: handleInput })));




const App = () => {
  const [input, setInput] = React.useState("0");
  const [output, setOutput] = React.useState("");
  const [calculatorData, setCalculatorData] = React.useState("");
  const [evaluated, setEvaluated] = React.useState(false);

  const handleClear = () => {
    setInput("0");
    setOutput("");
    setCalculatorData("");
    setEvaluated(false);
  };

  const handleNumber = value => {
    const valStr = value.toString();

    if (evaluated) {
      if (value === 0) {
        setInput("0");
        setCalculatorData("0");
      } else {
        setInput(valStr);
        setCalculatorData(valStr);
      }
      setEvaluated(false);
      return;
    }

    if (!calculatorData && input === "0") {
      if (value === 0) {
        setCalculatorData("0");
        return;
      } else {
        setInput(valStr);
        setCalculatorData(valStr);
        return;
      }
    }

    if (operators.includes(input)) {
      setInput(valStr);
      setCalculatorData(calculatorData + valStr);
      return;
    }

    if (input === "0" && value === 0) {
      return;
    }

    const newInput = input + valStr;
    setInput(newInput);
    setCalculatorData(calculatorData + valStr);
  };

  const dotOperator = () => {
    if (evaluated) {
      setInput("0.");
      setCalculatorData("0.");
      setEvaluated(false);
      return;
    }

    if (!calculatorData) {
      setInput("0.");
      setCalculatorData("0.");
      return;
    }

    const lastChar = calculatorData.charAt(calculatorData.length - 1);

    if (operatorSigns.includes(lastChar)) {
      setInput("0.");
      setCalculatorData(calculatorData + "0.");
      return;
    }

    if (input.includes(".")) {
      return;
    }

    setInput(input + ".");
    setCalculatorData(calculatorData + ".");
  };

  const handleOperators = value => {
    if (!calculatorData && value !== "-") return;

    let current = calculatorData;
    let lastChar = current.charAt(current.length - 1);
    let secondLast = current.charAt(current.length - 2 || 0);
    const op = value === "x" ? "*" : value;

    if (evaluated) {
      current = input.toString();
      lastChar = current.charAt(current.length - 1);
      secondLast = current.charAt(current.length - 2 || 0);
      setEvaluated(false);
    }

    if (operatorSigns.includes(lastChar)) {
      if (op === "-" && lastChar !== "-") {
        current = current + "-";
      } else {
        if (operatorSigns.includes(secondLast) && lastChar === "-" && op !== "-") {
          current = current.slice(0, -2) + op;
        } else if (op !== "-") {
          current = current.slice(0, -1) + op;
        }
      }
    } else {
      current = current + op;
    }

    setCalculatorData(current);
    setInput(value);
  };

  const handleSubmit = () => {
    if (!calculatorData) return;

    let expression = calculatorData.replace(/x/g, "*");

    const lastChar = expression.charAt(expression.length - 1);
    const secondLast = expression.charAt(expression.length - 2 || 0);

    if (operatorSigns.includes(lastChar)) {
      expression = expression.slice(0, -1);
    }
    if (operatorSigns.includes(secondLast) && lastChar === "-") {
      expression = expression.slice(0, -2);
    }

    try {
      let total = eval(expression);
      total = Math.round(total * 10000) / 10000;

      const totalStr = total.toString();
      setInput(totalStr);
      setOutput(expression + " = " + totalStr);
      setCalculatorData(totalStr);
      setEvaluated(true);
    } catch (err) {
      console.log("Eval error: ", err);
    }
  };

  const handleInput = value => {
    const isNumber = numbers.includes(value);

    if (value === "=") {
      handleSubmit();
    } else if (value === "AC") {
      handleClear();
    } else if (isNumber) {
      handleNumber(value);
    } else if (value === ".") {
      dotOperator();
    } else {
      handleOperators(value);
    }
  };

  const handleOutput = () => {
    setOutput(calculatorData);
  };

  React.useEffect(() => {
    handleOutput();
  }, [calculatorData]);

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement("div", { className: "calculator" }, /*#__PURE__*/
    React.createElement(Display, { input: input, output: output }), /*#__PURE__*/
    React.createElement(Keyboard, { handleInput: handleInput }))));



};

const root = createRoot(document.getElementById("app"));
root.render( /*#__PURE__*/React.createElement(App, null));