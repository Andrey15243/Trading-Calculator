let positionType = '';

function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
    document.getElementById('themeSwitch').checked = (theme === 'dark');
}

let savedTheme = localStorage.getItem('theme');

if (!savedTheme) {
    let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
} else {
    applyTheme(savedTheme);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});

function toggleTheme() {
    let newTheme = document.getElementById('themeSwitch').checked ? 'dark' : 'light';
    applyTheme(newTheme);
}

function setPosition(type) {
    positionType = type;
    document.getElementById('longButton').classList.toggle('active', type === 'long');
    document.getElementById('shortButton').classList.toggle('active', type === 'short');
    document.getElementById("warningText").classList.add("hidden");
}

function calculateVolume() {
    const deposit = parseFloat(document.getElementById("deposit").value);
    const riskPercent = parseFloat(document.getElementById("risk").value) / 100;
    const entryPrice = parseFloat(document.getElementById("entryPrice").value);
    const stopLoss = parseFloat(document.getElementById("stopLoss").value);

    if (!positionType) {
        document.getElementById("warningText").classList.remove("hidden");
        document.getElementById("result").innerText = "Выберите тип сделки (Лонг или Шорт).";
        return;
    }

    if ([deposit, riskPercent, entryPrice, stopLoss].some(isNaN) || deposit <= 0 || riskPercent <= 0 || entryPrice <= 0 || stopLoss <= 0) {
        document.getElementById("result").innerText = "Введите корректные данные!";
        return;
    }

    let priceDifference;
    if (positionType === "long") {
        if (stopLoss >= entryPrice) {
            document.getElementById("result").innerText = "Для лонга стоп-лосс должен быть ниже цены входа!";
            return;
        }
        priceDifference = entryPrice - stopLoss;
    } else {
        if (stopLoss <= entryPrice) {
            document.getElementById("result").innerText = "Для шорта стоп-лосс должен быть выше цены входа!";
            return;
        }
        priceDifference = stopLoss - entryPrice;
    }

    const riskAmount = deposit * riskPercent;
    const positionSize = riskAmount / priceDifference;
    const volumeInDollars = positionSize * entryPrice;

    document.getElementById("result").innerText = `Объём входа: $${volumeInDollars.toFixed(2)}`;
}

function resetForm() {
    document.getElementById("deposit").value = "";
    document.getElementById("risk").value = "";
    document.getElementById("entryPrice").value = "";
    document.getElementById("stopLoss").value = "";
    document.getElementById("result").innerText = "Ожидание данных...";
    document.getElementById("warningText").classList.add("hidden");
    document.getElementById('longButton').classList.remove('active');
    document.getElementById('shortButton').classList.remove('active');
    positionType = '';

    // Удаляем сохраненный депозит
    localStorage.removeItem("deposit");
}

// Загружаем сохранённое значение депозита при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    const savedDeposit = localStorage.getItem("deposit");
    if (savedDeposit !== null) {
        document.getElementById("deposit").value = savedDeposit;
    }
});

// Сохраняем депозит при изменении значения в поле
document.getElementById("deposit").addEventListener("input", function () {
    localStorage.setItem("deposit", this.value);
});

