          ///Переключение страниц///

const btnNavigate = document.querySelectorAll('.btnNavigate');
const content = document.querySelectorAll('.content');
    
// Добавляем обработчик событий на кнопки
btnNavigate.forEach(button => {
  button.addEventListener('click', () => {
    // Убираем класс active с других кнопок
    btnNavigate.forEach(btn => btn.classList.remove('active'));
        
    // Добавляем класс active на текущую кнопку
    button.classList.add('active');
    
    // Скрываем все вкладки
    content.forEach(tab => tab.classList.remove('active'));
        
    // Показываем вкладку, которая соответствует кнопке
    const targetTab = document.getElementById(button.getAttribute('data-target'));
    targetTab.classList.add('active');
  });
});



// Показываем первую вкладку по умолчанию
document.getElementById('clicker').classList.add('active');
    
// Показываем первую кнопку как активную по умолчанию
document.getElementById('mainBtn').classList.add('active');



      
        ////////Главная вкладка////////

// Зациклиная анимация монеты
setInterval(() => {
    const coin = document.querySelector('.coin');
    
    // Убираем анимацию
    coin.style.animation = 'none';
    
    // Принудительная перерисовка элемента (чтобы анимация сбросилась)
    coin.offsetHeight;  // Это поможет заставить браузер пересчитать элемент.
    
    // Применяем анимацию заново
    coin.style.animation = '';  // Теперь анимация снова начнёт работать.
}, 10000);  // Каждые 10 секунд

const clickerCoin = document.querySelector('#coinClickerId');
const tapScore = document.querySelector('#tapScore');

function handlePress(event) {
  event.preventDefault(); // Предотвращает скролл или зум

  const rect = clickerCoin.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  const offsetX = clientX - rect.left - rect.width / 2;
  const offsetY = clientY - rect.top - rect.height / 2;

  const deg = 60;

  const tiltX = (offsetY / rect.height) * deg;
  const tiltY = (offsetX / rect.width) * -deg;

  clickerCoin.style.setProperty('--tiltX', `${tiltX}deg`);
  clickerCoin.style.setProperty('--tiltY', `${tiltY}deg`);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plusOne');
  plusOne.textContent = '+1';
  plusOne.style.left = `${clientX - rect.left}px`;
  plusOne.style.top = `${clientY - rect.top}px`;

  clickerCoin.parentElement.appendChild(plusOne);

  setTimeout(() => {
    plusOne.remove();
  }, 2000);
}

// Сброс поворота при отпускании кнопки/пальца
function handleRelease() {
  clickerCoin.style.setProperty('--tiltX', `0deg`);
  clickerCoin.style.setProperty('--tiltY', `0deg`);
}

// Поддержка мыши
clickerCoin.addEventListener('mousedown', handlePress);
document.addEventListener('mouseup', handleRelease);

// Поддержка тач-скрина
clickerCoin.addEventListener('touchstart', handlePress);
document.addEventListener('touchend', handleRelease);
