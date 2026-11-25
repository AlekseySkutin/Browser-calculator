var input = document.querySelector("input");
var btn = document.getElementsByClassName("btn-evaluate")[0];
var resDiv = document.getElementsByClassName("result")[0];

const buttonsHolder = document.getElementById("buttons-holder");

initButton("C", () => { input.value = "" })

initButton("(", buttonContentToInput);
initButton(")", buttonContentToInput);
initButton("/", buttonContentToInput);


let i = 7;
while (true) {
    initButton(i, buttonContentToInput);

    i++;


    if (i === 10) {
        i = 4;
        initButton("*", buttonContentToInput)
    }
    else if (i === 7) {
        initButton("-", buttonContentToInput);
        i = 1;
    }
    else if (i === 4) {
        initButton("+",buttonContentToInput);
        initButton("0",buttonContentToInput);
        initButton(".",buttonContentToInput);
        initButton("^",buttonContentToInput);
        break;
    }
}

initButton("=", () => {
    let tokens = createTokens(input.value);
    let rpn = shuntingYard(tokens);
    let result = RPNEvaluator(rpn);

    resDiv.textContent = `Result: ${result}`;
})



function buttonContentToInput(event) {
    input.value += event.target.textContent;
}

function initButton(cnt, func) {
    const button = document.createElement("button");
    button.textContent = cnt;
    button.classList.add("calc-button")
    button.addEventListener("click", func)
    buttonsHolder.append(button);

}





function createTokens(str) {
    str = str.split(" ").join('');

    let tokens = [];
    let buffer = "";
    let previousChar = "";

    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (i > 0)
            previousChar = str[i - 1];
        if (c.match(/\d/) || c.match(/\./)) {
            buffer += c;
        }
        else if (c.match(/\-/) && previousChar === '(') {
            buffer += c;
        }
        else if (c.match(/[(\^+\-*/)]/)) {
            tokens.push(buffer);
            tokens.push(c);
            buffer = '';
        }
    }
    if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = '';
    }
    return tokens.filter(c => c !== '');





    let newStr = str.split(" ").join('');
    let arr = newStr.split(/([(\^+\-*/)])/).filter(c => c !== '');
    return arr;
}

const operators = {
    '^': {
        prec: 4,
        assoc: 'right',
    },
    '*': {
        prec: 3,
        assoc: 'left',
    },
    '/': {
        prec: 3,
        assoc: 'left',
    },
    '+': {
        prec: 2,
        assoc: 'left',
    },
    '-': {
        prec: 2,
        assoc: 'left',
    },
};

const assert = (predicate) => {
    if (predicate) return;
    throw new Error("Assertion failed due to invalid token");
}

//for stack use push(token) and pop(), for queue use push(token) and shift()
function shuntingYard(arr) {
    let outputQueue = [];
    let operatorStack = [];

    const handleToken = (token) => {
        if (!isNaN(parseFloat(token)))
            outputQueue.push(token)

        //no functions for now

        else if (Object.keys(operators).includes(token)) {
            const o1 = token;
            let o2 = operatorStack.at(-1);

            while (
                o2 != undefined && o2 !== '(' &&
                (operators[o2].prec > operators[o1].prec ||
                    (operators[o2].prec === operators[o1].prec && operators[o1].assoc === 'left'))
            ) {
                outputQueue.push(operatorStack.pop());
                o2 = operatorStack.at(-1);
            }
            operatorStack.push(o1);
        }



        //no comma for now;

        else if (token === "(") {
            operatorStack.push(token);
        }
        else if (token === ")") {
            let topOfStack = operatorStack.at(-1);
            while (topOfStack !== '(') {
                assert(operatorStack.length !== 0);
                outputQueue.push(operatorStack.pop());
                topOfStack = operatorStack.at(-1);
            }
            assert(operatorStack.at(-1) === '(');
            operatorStack.pop();
        }
    }

    for (let token of arr) {
        handleToken(token);
    }
    while (operatorStack.length !== 0) {
        assert(operatorStack.at(-1) !== '(');
        outputQueue.push(operatorStack.pop());
    }

    //check for wrong tokens 
    return outputQueue;
}

const RPNEvaluator = (input) => {
    const stack = [];

    const handleToken = (token) => {
        if (!isNaN(parseFloat(token))) {
            stack.push(token);
            return;
        }

        const right = parseFloat(stack.pop());
        const left = parseFloat(stack.pop());

        switch (token) {
            case '+': // Addition
                stack.push(left + right);
                return;
            case '-': // Subtraction
                stack.push(left - right);
                return;
            case '*': // Multiplication
                stack.push(left * right);
                return;
            case '/': // Division
                stack.push(left / right);
                return;
            case '^': // Exponentiation
                stack.push(left ** right);
                return;
            default:
                throw new Error(`Invalid token: ${token}`);
        }
    };

    for (let i of input) {
        if (i === ' ') continue;

        handleToken(i);
    }

    return stack.pop();
};


//REverse polish notation evaluator




