'use strict';

var randomRandint = function (from, to) {
  var number = from + Math.floor(Math.random() * (to - from));
  return number;
};


// Функция которая возвращает рандомный элемент из массива(пригодится)
var randomElement = function (array) {
  var randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

// Рандомный элемент и удаление из массива
var randomElementAndRemove = function (array) {
  var randomNumber = Math.floor(Math.random() * array.length);

  var result = array[randomNumber];
  array[randomNumber] = array[array.length - 1];
  array.pop();
  return result;
};


// Рандомный состав массива из массивов
var randomArray = function (array) {
  var resultLength = randomRandint(1, array.length + 1);

  var result = [];
  for (var i = 0; i < resultLength; i++) {
    var x = randomElementAndRemove(array); // результат вызова ф-ции, которая достает рандомный элемент и удаляет его из массива
    result.push(x);
  }
  return result;
};


// 1.Напишите функцию для создания массива из 8 сгенерированных JS объектов.
var createPin = function (pinNumber) {
  var x = randomRandint(130, 630 + 1);
  var y = randomRandint(130, 630 + 1);

  return {
    author: {
      avatar: 'img/avatars/user0' + pinNumber + '.png'
    },

    offer: {
      title: ' ',
      address: x + ' ' + y,
      price: randomRandint(1000, 100000),
      type: randomElement(['palace', 'flat', 'house', 'bungalo']),
      rooms: randomRandint(1, 5),
      guests: randomRandint(1, 10),
      checkin: randomElement(['12:00', '13:00', '14:00']),
      checkout: randomElement(['12:00', '13:00', '14:00']),
      features: randomArray(['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']),
      description: ' ',
      photos: randomArray([
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'])
    },

    location: {
      x: x,
      y: y
    }
  };
};


// Функция создает массив обектов
var createPins = function (pinsCount) {
  var result = [];

  for (var i = 0; i < pinsCount; i++) {
    result.push(createPin(i + 1));
  }

  return result;
};


// Создание DOM-элементов и заполнение данными из массива
var renderPinElement = function (pin) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', 'заголовок объявления');

  return pinElement;
};

// Функция принимает массив JS-обьектов Визардов и отображает на странице
var displayPins = function (pins) { // отображение пинов. принимаю пины
  var fragment = document.createDocumentFragment(); // создаю фрагмент

  for (var i = 0; i < pins.length; i++) {
    var pinElement = renderPinElement(pins[i]); // превращает JS-обьект(элемент) в DOM-элемент
    fragment.appendChild(pinElement); // всасываю фрагмент в пин элемент
  }

  var pinsListElement = document.querySelector('.map__pins');
  pinsListElement.appendChild(fragment);
};

displayPins(createPins(8));

// Переключение в активное состояние
document.querySelector('.map').classList.remove('map--faded');

