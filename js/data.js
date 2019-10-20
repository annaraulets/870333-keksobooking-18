'use strict';

window.data = (function () {
  var randomRandInt = function (from, to) {
    var number = from + Math.floor(Math.random() * (to + 1 - from));
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

    array.splice(randomNumber, 1);

    return result;
  };


  // Рандомный состав массива из массивов
  var randomArray = function (array) {
    var arrayCopy = array.slice();
    var resultLength = randomRandInt(1, arrayCopy.length);

    var result = [];
    for (var i = 0; i < resultLength; i++) {
      var x = randomElementAndRemove(arrayCopy); // результат вызова ф-ции, которая достает рандомный элемент и удаляет его из массива
      result.push(x);
    }
    return result;
  };


  var PRICE_MIN = 1000;
  var PRICE_MAX = 100000;
  var HOTEL_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;
  var GUESTS_MIN = 1;
  var GUESTS_MAX = 10;
  var TIMES = ['12:00', '13:00', '14:00'];
  var FACILITIES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTO_LINKS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


  // 1.Напишите функцию для создания массива из 8 сгенерированных JS объектов.
  var createPin = function (pinNumber) {
    var mapWidth = document.querySelector('.map__overlay').offsetWidth;
    var x = randomRandInt(100, mapWidth);
    var y = randomRandInt(130, 630);


    return {
      author: {
        avatar: 'img/avatars/user0' + pinNumber + '.png'
      },

      offer: {
        title: 'Заголовок обьявления',
        address: x + ', ' + y,
        price: randomRandInt(PRICE_MIN, PRICE_MAX),
        type: randomElement(HOTEL_TYPES),
        rooms: randomRandInt(ROOMS_MIN, ROOMS_MAX),
        guests: randomRandInt(GUESTS_MIN, GUESTS_MAX),
        checkin: randomElement(TIMES),
        checkout: randomElement(TIMES),
        features: randomArray(FACILITIES),
        description: ' ',
        photos: randomArray(PHOTO_LINKS)
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

    for (var i = 1; i <= pinsCount; i++) {
      result.push(createPin(i));
    }

    return result;
  };


  return {
    createPins: createPins,
    FACILITIES: FACILITIES
  };
})();
