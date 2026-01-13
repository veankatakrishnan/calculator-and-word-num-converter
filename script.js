document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');
    const toWordsBtn = document.getElementById('to-words');
    const toNumberBtn = document.getElementById('to-number');
    const converterInput = document.getElementById('converter-input');
    const converterOutput = document.getElementById('converter-output');

    let currentInput = '';
    let memory = 0;

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('.btn')) return;

        const key = e.target.dataset.key;
        const value = e.target.textContent;

        handleInput(key, value);
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        let button;

        if (key === "Enter") {
            e.preventDefault();
            button = document.getElementById('equals');
        } else if (key === "Backspace") {
            button = document.querySelector('[data-key="Backspace"]');
        } else {
            button = document.querySelector(`[data-key="${key}"]`);
        }

        if (button) {
            button.click();
        }
    });

    toWordsBtn.addEventListener('click', () => {
        const num = parseFloat(converterInput.value);
        if (!isNaN(num)) {
            converterOutput.textContent = numberToWords.toWords(num);
        } else {
            converterOutput.textContent = 'Invalid number';
        }
    });

    toNumberBtn.addEventListener('click', () => {
        const text = converterInput.value.toLowerCase();
        converterOutput.textContent = wordsToNumber(text);
    });


    function handleInput(key, value) {
        if (display.value === 'Error') {
            currentInput = '';
            display.value = '';
        }

        switch (key) {
            case '=':
                calculate();
                break;
            case 'c':
                currentInput = '';
                display.value = '';
                break;
            case 'Backspace':
                currentInput = currentInput.slice(0, -1);
                display.value = currentInput;
                break;
            case 'operator': // Handle +, -, *, /
                // Prevent multiple operators in a row if needed, but for now just add
                currentInput += value;
                display.value = currentInput;
                break;
            default:
                // Check if it's a number or basic operator
                if (['+', '-', '*', '/'].includes(key)) {
                    currentInput += key;
                } else {
                    currentInput += value;
                }
                display.value = currentInput;
        }
    }

    function calculate() {
        if (currentInput === '') return;
        try {
            const result = evaluate(currentInput);
            display.value = result;
            currentInput = result.toString();
        } catch (error) {
            display.value = 'Error';
            currentInput = '';
        }
    }

    function evaluate(expression) {
        // Use math.js for safe evaluation
        return math.evaluate(expression);
    }

    function wordsToNumber(words) {
        const numberWords = {
            zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
            ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
            seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
            sixty: 60, seventy: 70, eighty: 80, ninety: 90
        };

        const magnitudeWords = {
            hundred: 100, thousand: 1000, million: 1000000
        };

        const cleanedWords = words.trim().toLowerCase();
        if (cleanedWords === 'zero') return 0;

        // Split by spaces, hyphens, or commas, and remove empty parts
        const parts = cleanedWords.split(/[\s,-]+/).filter(part => part.length > 0);
        let total = 0;
        let currentNumber = 0;

        for (const part of parts) {
            if (numberWords[part] !== undefined) {
                currentNumber += numberWords[part];
            } else if (magnitudeWords[part] !== undefined) {
                currentNumber *= magnitudeWords[part];
                if (magnitudeWords[part] > 100) {
                    total += currentNumber;
                    currentNumber = 0;
                }
            }
        }
        total += currentNumber;
        // If total is 0 but input wasn't "zero", it might be invalid or just empty. 
        // But since we handled "zero" specifically above, 0 here implies failure to parse any numbers?
        // Actually, if input is "garbage", total will be 0. We should probably return 'Invalid input' if 0 and cleanedWords !== 'zero'.
        // Wait, "zero" case is handled. So if total is 0 here, it means no known words were found.
        return (total === 0 && cleanedWords !== 'zero') ? 'Invalid input' : total;
    }
});
