const passwordInput = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBER = "0123456789";
const SYMBOL = "!@#$%&*()_+-=[]{}<>?";

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function random(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = random(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePassword() {

    let chars = "";
    let mandatory = [];

    if (uppercase.checked) {
        chars += UPPER;
        mandatory.push(UPPER[random(UPPER.length)]);
    }

    if (lowercase.checked) {
        chars += LOWER;
        mandatory.push(LOWER[random(LOWER.length)]);
    }

    if (numbers.checked) {
        chars += NUMBER;
        mandatory.push(NUMBER[random(NUMBER.length)]);
    }

    if (symbols.checked) {
        chars += SYMBOL;
        mandatory.push(SYMBOL[random(SYMBOL.length)]);
    }

    if (!chars) {
        alert("Selecione ao menos uma opção.");
        return;
    }

    const length = Number(lengthSlider.value);

    let password = [...mandatory];

    while (password.length < length) {
        password.push(chars[random(chars.length)]);
    }

    password = shuffle(password);

    passwordInput.value = password.join("");

    evaluateStrength(passwordInput.value);
}

function evaluateStrength(password) {

    let score = 0;

    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
        strengthFill.style.width = "30%";
        strengthFill.style.background = "#dc2626";
        strengthText.textContent = "Fraca";
    }
    else if (score <= 4) {
        strengthFill.style.width = "65%";
        strengthFill.style.background = "#f59e0b";
        strengthText.textContent = "Média";
    }
    else {
        strengthFill.style.width = "100%";
        strengthFill.style.background = "#16a34a";
        strengthText.textContent = "Forte";
    }
}

copyBtn.addEventListener("click", async () => {

    if (!passwordInput.value) return;

    try {
        await navigator.clipboard.writeText(passwordInput.value);

        copyBtn.textContent = "Copiado ✓";

        setTimeout(() => {
            copyBtn.textContent = "Copiar";
        }, 2000);

    } catch {
        alert("Erro ao copiar.");
    }
});

generateBtn.addEventListener("click", generatePassword);

generatePassword();