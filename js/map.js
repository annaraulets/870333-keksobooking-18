'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var PINS_COUNT = 8;
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var PIN_OFFSET_NOTACTIVE = 25;
  var HOTEL_TYPES_DICT = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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

    var facilities = window.data.FACILITIES;

    for (var i = 0; i < facilities.length; i++) {
      if (pin.offer.features.indexOf(facilities[i]) === -1) {
        cardElement.querySelector('.popup__feature--' + facilities[i]).remove();
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

  var pinsData = window.data.createPins(PINS_COUNT);
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
        document.querySelector('.map__filters-container')
    );
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

})();
