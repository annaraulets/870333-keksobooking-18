'use strict';

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

var PINS_COUNT = 8;
var PIN_OFFSET_X = 25;
var PIN_OFFSET_Y = 70;
var PRICE_MIN = 1000;
var PRICE_MAX = 100000;
var HOTEL_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var HOTEL_TYPES_DICT = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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


// Создание DOM-элементов и заполнение данными из массива
var renderPinElement = function (pin) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = (pin.location.x - PIN_OFFSET_X) + 'px';
  pinElement.style.top = (pin.location.y - PIN_OFFSET_Y) + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

// Доп задание. фцнкия делает элемент карточки
var renderCardElement = function (pin) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
  cardElement.querySelector('.popup__title').textContent = pin.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = HOTEL_TYPES_DICT[pin.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для '
  + pin.offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin
  + ', выезд до ' + pin.offer.checkout + '.';

  for (var i = 0; i < FACILITIES.length; i++) {
    if (pin.offer.features.indexOf(FACILITIES[i]) === -1) {
      cardElement.querySelector('.popup__feature--' + FACILITIES[i]).remove();
    }
  }

  cardElement.querySelector('.popup__description').textContent = pin.offer.description;
  // Заполнение фотографиями из массива в Dom-a
  var photoTemplate = cardTemplate.querySelector('.popup__photo');
  var photoFragment = document.createDocumentFragment();

  for (i = 0; i < pin.offer.photos.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = pin.offer.photos[i];
    photoFragment.appendChild(photoElement);
  }
  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(photoFragment);

  return cardElement;
};

// Функция принимает массив JS-обьектов и отображает на странице
var displayPins = function (pins) { // отображение пинов. принимаю пины
  var fragment = document.createDocumentFragment(); // создаю фрагмент

  for (var i = 0; i < pins.length; i++) {
    var pinElement = renderPinElement(pins[i]); // превращает JS-обьект(элемент) в DOM-элемент
    fragment.appendChild(pinElement); // всасываю фрагмент в пин элемент
  }

  var pinsListElement = document.querySelector('.map__pins');
  pinsListElement.appendChild(fragment);
};

var pinsData = createPins(PINS_COUNT);
displayPins(pinsData);

// Отображение карточки с первым объявлением
document.querySelector('.map').insertBefore(
    renderCardElement(pinsData[0]),
    document.querySelector('.map__filters-container')
);

// Переключение в активное состояние
document.querySelector('.map').classList.remove('map--faded');

