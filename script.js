document.addEventListener("DOMContentLoaded", function () {
    let position = null; // Выбранная позиция (long или short)

    // Новые переменные для двух разных состояний
    let menuSelection = null; // "btnCalulator" или "tradingView"
    let tradePosition = null; // "long" или "short"

    const longBtn = document.getElementById("long");
    const shortBtn = document.getElementById("short");
    const calculateBtn = document.getElementById("result");
    const resetBtn = document.querySelector(".btnReset");

    const depoInput = document.getElementById("depo");
    const riskInput = document.getElementById("risk");
    const entryInput = document.getElementById("in");
    const stoplossInput = document.getElementById("stoploss");
    const resultBox = document.getElementById("resultInput");


    const calcBtn = document.getElementById("btnCalulator");
    const tradingViewBtn = document.getElementById("tradingView");

    const settings = document.getElementById("settings");
    const backBtn = document.getElementById("backBtn");

    // Переключение темы
    const themeToggle = document.getElementById("theme-toggle");


    // При загрузке делаем calcBtn активной
    calcBtn.classList.add("active");

    // Восстанавливаем значение депозита при загрузке страницы
    if (localStorage.getItem("depoValue")) {
        depoInput.value = localStorage.getItem("depoValue");
    }

    // Следим за вводом и сохраняем значение депозита в LocalStorage
    depoInput.addEventListener("input", function () {
        localStorage.setItem("depoValue", this.value);
    });


    // выподающее меню
    settings.addEventListener("click", function() {
        document.getElementById("menu").classList.toggle("active");
    });

    // Закрытие меню при клике вне его области
    document.addEventListener("click", function(event) {
        const menu = document.getElementById("menu");
        const settingsBtn = document.getElementById("settings");
        
        if (!menu.contains(event.target) && !settingsBtn.contains(event.target)) {
            menu.classList.remove("active");
        }
    });

    backBtn.addEventListener("click", function() {
        document.getElementById("menu").classList.remove("active");
    });




    // Выбор кнопки меню
    function selectMenu(type) {
        menuSelection = type;
        calcBtn.classList.remove("active");
        tradingViewBtn.classList.remove("active");

        if (type === "btnCalulator") {
            calcBtn.classList.add("active");
        } else {
            tradingViewBtn.classList.add("active");
        }
    }

    // Обработчики кнопок меню
    calcBtn.addEventListener("click", () => selectMenu("btnCalulator"));
    tradingViewBtn.addEventListener("click", () => selectMenu("tradingView"));

    calcBtn.addEventListener("click", () => {
        selectMenu("btnCalulator");
        document.getElementById("page-calculator").style.display = "flex";
        document.getElementById("header").style.display = "flex";
        document.getElementById("tradingview-widget").style.display = "none";

        // Убираем фоновое изображение
    document.body.style.backgroundImage = "none";
    });
    
    tradingViewBtn.addEventListener("click", () => {
        selectMenu("tradingView");
        document.getElementById("page-calculator").style.display = "none";
        document.getElementById("header").style.display = "none";
        document.getElementById("tradingview-widget").style.display = "flex";

        // Добавляем фоновое изображение для body
    document.body.style.backgroundImage = "url('./icons/NotLud.png')";
    document.body.style.backgroundSize = "cover"; // Растягивает изображение на весь экран
    document.body.style.backgroundPosition = "center"; // Выравнивает по центру
    });
    

    // function selectPosition(type) {
    //     tradePosition = type;
    //     longBtn.classList.remove("active");
    //     shortBtn.classList.remove("active");

    //     if (type === "long") {
    //         longBtn.classList.add("active");
    //     } else {
    //         shortBtn.classList.add("active");
    //     }
    // }

    // Функция выбора позиции
    function selectPosition(type) {
        position = type;
    
        // Сначала убираем активный класс у обеих кнопок
        longBtn.classList.remove("active");
        shortBtn.classList.remove("active");
    
        // Затем добавляем активный класс только к выбранной кнопке
        if (type === "long") {
            longBtn.classList.add("active");
        } else {
            shortBtn.classList.add("active");
        }
    }

    
    
    // Обработчики кнопок Long/Short
    longBtn.addEventListener("click", () => selectPosition("long"));
    shortBtn.addEventListener("click", () => selectPosition("short"));

    // Функция расчёта объёма входа
    calculateBtn.addEventListener("click", function () {
        if (!position) {
            resultBox.textContent = 'Выберите позицию: Long или Short';
            resultBox.classList.add('resultBoxErr')
            return;
        }

        resultBox.classList.remove('resultBoxErr');

        const depo = parseFloat(depoInput.value);
        const risk = parseFloat(riskInput.value);
        const entry = parseFloat(entryInput.value);
        const stoploss = parseFloat(stoplossInput.value);

        if (isNaN(depo) || isNaN(risk) || isNaN(entry) || isNaN(stoploss) || depo <= 0 || risk <= 0) {
            resultBox.textContent = "Ошибка! Заполните все поля корректно.";
            return;
        }

        // Проверяем условия для Long и Short
        if (position === "long" && entry <= stoploss) {
            resultBox.textContent = "Ошибка! В Long-позиции цена входа должна быть выше стоп-лосса.";
            return;
        }

        if (position === "short" && entry >= stoploss) {
            resultBox.textContent = "Ошибка! В Short-позиции цена входа должна быть ниже стоп-лосса.";
            return;
        }

        // Рассчитываем риск в валюте депозита
        const riskAmount = (depo * risk) / 100;
        const stopLossSize = Math.abs(entry - stoploss); // Разница между входом и стоп-лоссом

        if (stopLossSize === 0) {
            resultBox.textContent = "Ошибка! Стоп-лосс не может быть равен цене входа.";
            return;
        }

        const volume = (riskAmount / stopLossSize) * entry;
        if (risk >= 5) {
            resultBox.textContent = `С тебя ${volume.toFixed(2)}, лудоман`;
        } else {
            resultBox.textContent = `Объём входа: ${volume.toFixed(2)}`;
        }

    });

    // Функция сброса всех полей, кроме депозита
    resetBtn.addEventListener("click", function () {
        depoInput.value = "";
        riskInput.value = "";
        entryInput.value = "";
        stoplossInput.value = "";
        resultBox.textContent = "Ожидание данных...";
        resultBox.classList.remove("resultBoxErr");
        position = null;
        longBtn.classList.remove("active");
        shortBtn.classList.remove("active");

        // Удаляем депозит из LocalStorage, чтобы он не сохранялся
        localStorage.removeItem("depoValue");
    });

    // Автоматическая замена запятой на точку в полях ввода
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/,/g, '.'); // Заменяем запятые на точки
        });
    });
    
    if (navigator.userAgent.includes("Telegram")) {
        document.body.classList.add("telegram-webview");
    }

    // Проверяем сохранённую тему при загрузке страницы
    if (localStorage.getItem("theme") === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggle.checked = true;
    }

    // Обработчик смены темы
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });

    themeToggle.addEventListener("change", () => {
        const newTheme = themeToggle.checked ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    
        // Пересоздаём виджет с новой темой
        createTradingViewWidget(newTheme);
    });
    
    // Функция пересоздания виджета
    function createTradingViewWidget(theme) {
        // Удаляем старый виджет
        document.getElementById('tradingview-widget').innerHTML = '';
    
        new TradingView.widget({
            "container_id": "tradingview-widget",
            "width": "100%",
            "height": "100%",
            "symbol": "BYBIT:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": theme,  // Используем новую тему
            "style": "1",
            "locale": "ru",
            "watchlist": ["BYBIT:BTCUSDT", "BYBIT:ETHUSDT"],
            "hide_top_toolbar": false,
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true
        });
    }
    
    // При загрузке страницы создаём виджет с сохранённой темой
    document.addEventListener("DOMContentLoaded", () => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeToggle.checked = savedTheme === "light";
    
        createTradingViewWidget(savedTheme);
    });
    

});
