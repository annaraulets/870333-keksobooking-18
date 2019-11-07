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

  var randomRandInt = function (from, to) {
    var number = from + Math.floor(Math.random() * (to + 1 - from));
    return number;
  };


  var randomElement = function (items) {
    var randomNumber = Math.floor(Math.random() * items.length);
    return items[randomNumber];
  };

  var randomElementAndRemove = function (items) {
    var randomNumber = Math.floor(Math.random() * items.length);
    var result = items[randomNumber];

    items.splice(randomNumber, 1);

    return result;
  };


  var randomArray = function (items) {
    var itemsCopy = items.slice();
    var resultLength = randomRandInt(1, itemsCopy.length);

    var result = [];
    for (var i = 0; i < resultLength; i++) {
      var x = randomElementAndRemove(itemsCopy);
      result.push(x);
    }
    return result;
  };


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
