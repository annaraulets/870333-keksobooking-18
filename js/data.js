'use strict';

window.data = (function () {

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

  var getRandomInt = function (from, to) {
    var number = from + Math.floor(Math.random() * (to + 1 - from));
    return number;
  };


  var getRandomElement = function (items) {
    var randomNumber = Math.floor(Math.random() * items.length);
    return items[randomNumber];
  };

  var getRandomElementAndRemove = function (items) {
    var randomNumber = Math.floor(Math.random() * items.length);
    var result = items[randomNumber];

    items.splice(randomNumber, 1);

    return result;
  };


  var getRandomArray = function (items) {
    var itemsCopy = items.slice();
    var resultLength = getRandomInt(1, itemsCopy.length);

    var randomItems = [];
    for (var i = 0; i < resultLength; i++) {
      var x = getRandomElementAndRemove(itemsCopy);
      randomItems.push(x);
    }
    return randomItems;
  };


  var createPin = function (pinNumber) {
    var mapWidth = document.querySelector('.map__overlay').offsetWidth;
    var pointX = getRandomInt(100, mapWidth);
    var pointY = getRandomInt(130, 630);


    return {
      author: {
        avatar: 'img/avatars/user0' + pinNumber + '.png'
      },

      offer: {
        title: 'Заголовок обьявления',
        address: pointX + ', ' + pointY,
        price: getRandomInt(PRICE_MIN, PRICE_MAX),
        type: getRandomElement(HOTEL_TYPES),
        rooms: getRandomInt(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomInt(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomElement(TIMES),
        checkout: getRandomElement(TIMES),
        features: getRandomArray(FACILITIES),
        description: ' ',
        photos: getRandomArray(PHOTO_LINKS)
      },

      location: {
        x: pointX,
        y: pointY
      }
    };
  };

  var createPins = function (pinsCount) {
    var pins = [];

    for (var i = 1; i <= pinsCount; i++) {
      pins.push(createPin(i));
    }

    return pins;
  };


  return {
    createPins: createPins,
    FACILITIES: FACILITIES
  };
})();
