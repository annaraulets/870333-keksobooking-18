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
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var PINS_COUNT = 8;
var PIN_OFFSET_X = 25;
var PIN_OFFSET_Y = 70;
var PIN_OFFSET_NOTACTIVE = 25;
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

  // Открытие карточки по нажатию
  pinElement.addEventListener('click', function () {
    addCardElement(pin);
  });

  pinElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      addCardElement(pin);
    }
  });

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

  // Закртыие карточки по нажатию
  var closeCardButton = cardElement.querySelector('.popup__close');
  closeCardButton.addEventListener('click', function () {
    cardElement.remove();
  });
  closeCardButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      cardElement.remove();
    }
  });

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
// displayPins(pinsData);


// Удаление карточки при открытие следующей карточки
var closeCardElement = function () {
  var cardElement = document.querySelector('.map').querySelector('.map__card');
  if (cardElement) {
    cardElement.remove();
  }
};

// Отображение карточки с объявлением
var addCardElement = function (pin) {
  closeCardElement();
  document.querySelector('.map').insertBefore(
      renderCardElement(pin),
      document.querySelector('.map__filters-container'));
};

// Закрытие карточки по нажатию ESC
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCardElement();
  }
});


// Задание 8
// НЕААКТИВНОЕ СОСТОЯНИЕ
// var mapMain = document.querySelector('.map');

var adForm = document.querySelector('.notice').querySelector('.ad-form');
var adFormDisable = adForm.querySelectorAll('fieldset');
for (var i = 0; i < adFormDisable.length; i++) {
  adFormDisable[i].setAttribute('disabled', 'disabled');
}

// Активирование карты
var mapActivate = function () {
  document.querySelector('.map').classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  for (i = 0; i < adFormDisable.length; i++) {
    adFormDisable[i].removeAttribute('disabled');
  }
};

var btnActivate = document.querySelector('.map__pins').querySelector('.map__pin--main');

// отрезает 2 последние буквы
var removePx = function (kek) {
  var lol = parseInt(kek.slice(0, kek.length - 2), 10);
  return lol;
};

// Адрес метки
var updateAddress = function (isActive) {
  var left = removePx(btnActivate.style.left);
  var top = removePx(btnActivate.style.top);


  left += PIN_OFFSET_X;
  if (isActive) {
    top += PIN_OFFSET_Y;
  } else {
    top += PIN_OFFSET_NOTACTIVE;
  }

  var address = left + ', ' + top;
  adForm.querySelector('input[name="address"]').value = address;
};


// Нажатие на клавную кнопку и вход в активный режим
btnActivate.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  mapActivate();
  updateAddress(true);
  displayPins(pinsData);

});

btnActivate.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    mapActivate();
    updateAddress(true);
  }
});

updateAddress(false);


// Валидация
// Валидация поля Заголовка
var titleInput = adForm.querySelector('input[name="title"]');

titleInput.addEventListener('invalid', function () {
  if (titleInput.validity.tooShort) {
    titleInput.setCustomValidity('Минимальная длина — 30 символов');
  } else if (titleInput.validity.tooLong) {
    titleInput.setCustomValidity('Максимальная длина — 100 символов');
  } else if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Обязательное поле ввода');
  } else {
    titleInput.setCustomValidity('');
  }
});


// Validation - price per night
var priceInput = adForm.querySelector('input[name="price"]');

priceInput.addEventListener('invalid', function () {
  if (priceInput.validity.tooLong) {
    priceInput.setCustomValidity('Максимальное значение - 1000000');
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле ввода');
  } else {
    priceInput.setCustomValidity('');
  }
});

// Тип жилья
var hotelTypeSelect = adForm.querySelector('select[name="type"]');

var hotelTypeChangeHandler = function () {
  if (hotelTypeSelect.value === 'bungalo') {
    priceInput.min = '0';
    priceInput.placeholder = '0';
  } else if (hotelTypeSelect.value === 'flat') {
    priceInput.min = '1000';
    priceInput.placeholder = '1000';
  } else if (hotelTypeSelect.value === 'house') {
    priceInput.min = '5000';
    priceInput.placeholder = '5000';
  } else if (hotelTypeSelect.value === 'palace') {
    priceInput.min = '10000';
    priceInput.placeholder = '10000';
  }
};


hotelTypeSelect.addEventListener('change', hotelTypeChangeHandler);
hotelTypeChangeHandler();

// Синхронизация вьезда и выезда
var timeInSelect = adForm.querySelector('select[name="timein"]');
var timeOutSelect = adForm.querySelector('select[name="timeout"]');

timeInSelect.addEventListener('change', function () {
  timeOutSelect.value = timeInSelect.value;
});

timeOutSelect.addEventListener('change', function () {
  timeInSelect.value = timeOutSelect.value;
});


// Настройка гостей и комнат
var roomsSelect = adForm.querySelector('select[name="rooms"]');
var capacitySelect = adForm.querySelector('select[name="capacity"]');
var capacityOption3 = capacitySelect.querySelector('option[value="3"]');
var capacityOption2 = capacitySelect.querySelector('option[value="2"]');
var capacityOption1 = capacitySelect.querySelector('option[value="1"]');
var capacityOption0 = capacitySelect.querySelector('option[value="0"]');

var roomsSelectChangeHandler = function () {
  if (roomsSelect.value === '1') {
    capacityOption1.removeAttribute('disabled');

    capacityOption3.setAttribute('disabled', 'disabled');
    capacityOption2.setAttribute('disabled', 'disabled');
    capacityOption0.setAttribute('disabled', 'disabled');
  } else if (roomsSelect.value === '2') {
    capacityOption1.removeAttribute('disabled');
    capacityOption2.removeAttribute('disabled');

    capacityOption3.setAttribute('disabled', 'disabled');
    capacityOption0.setAttribute('disabled', 'disabled');
  } else if (roomsSelect.value === '3') {
    capacityOption1.removeAttribute('disabled');
    capacityOption2.removeAttribute('disabled');
    capacityOption3.removeAttribute('disabled');

    capacityOption0.setAttribute('disabled', 'disabled');
  } else if (roomsSelect.value === '100') {
    capacityOption1.setAttribute('disabled', 'disabled');
    capacityOption2.setAttribute('disabled', 'disabled');
    capacityOption3.setAttribute('disabled', 'disabled');

    capacityOption0.removeAttribute('disabled');
  }

  var selectedOption = capacitySelect.querySelector('option[value="' + capacitySelect.value + '"]');
  if (selectedOption.getAttribute('disabled') === 'disabled') {
    var notDisableOption = capacitySelect.querySelector('option:not([disabled])');
    capacitySelect.value = notDisableOption.value;
  }

};

roomsSelect.addEventListener('change', roomsSelectChangeHandler);
roomsSelectChangeHandler();
