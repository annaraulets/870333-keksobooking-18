'use strict';

window.map = (function () {

  var HOTEL_TYPES_DICT = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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
      window.util.isEnterEvent(evt, function () {
        cardElement.remove();
      });
    });

    return cardElement;
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
    window.util.isEscEvent(evt, closeCardElement);
  });

  // Удаление карточки при открытие следующей карточки
  var closeCardElement = function () {
    var cardElement = document.querySelector('.map').querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
    }
  };

  return {
    addCardElement: addCardElement,
    closeCardElement: closeCardElement
  };
})();


(function () {
  // var PINS_COUNT = 8;
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var PIN_OFFSET_NOTACTIVE = 25;
  var filtersForm = document.querySelector('.map .map__filters');
  var housingTypeSelect = filtersForm.querySelector('select[name="housing-type"]');
  var housingPriceSelect = filtersForm.querySelector('select[name="housing-price"]');
  var housingRoomSelect = filtersForm.querySelector('select[name="housing-rooms"]');
  var housingGuestSelect = filtersForm.querySelector('select[name="housing-guests"]');
  var featuresInputs = filtersForm.querySelectorAll('.map__features input[name="features"]');
  // var filterWifiInput = document.getElementById('filter-wifi');
  // var filterDishwasherInput = document.getElementById('filter-dishwasher');
  // var filterParkingInput = document.getElementById('filter-parking');
  // var filterWasherInput = document.getElementById('filter-washer');
  // var filterElevatorInput = document.getElementById('filter-elevator');
  // var filterConditionerInput = document.getElementById('filter-conditioner');

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
      window.map.addCardElement(pin);
    });

    pinElement.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, function () {
        window.map.addCardElement(pin);
      });
    });

    return pinElement;
  };

  // Функция принимает массив JS-обьектов и отображает на странице
  var displayPins = function (pins) { // отображение пинов. принимаю пины
    var fragment = document.createDocumentFragment(); // создаю фрагмент

    for (var i = 0; i < pins.length; i++) {
      var pinElement = renderPinElement(pins[i]); // превращает JS-обьект(элемент) в DOM-элемент
      fragment.appendChild(pinElement); // всасываю фрагмент в пин элемент
    }

    var pinsListElement = document.querySelector('.map__pins');

    var pinsRemove = pinsListElement.querySelectorAll('.map__pin');
    for (i = 0; i < pinsRemove.length; i++) {
      if (!pinsRemove[i].classList.contains('map__pin--main')) {
        pinsRemove[i].remove();
      }
    }

    pinsListElement.appendChild(fragment);
  };

  // var pinsData = window.data.createPins(PINS_COUNT);
  var pinsData;
  window.backend.load(function (response) {
    pinsData = response;
  }, window.util.showError
  );


  // Задание 8
  // НЕААКТИВНОЕ СОСТОЯНИЕ
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

  var DEBOUNCE_INTERVAL = 300; // ms
  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };


  var reloadPinsInstant = function () {
    window.map.closeCardElement();
    var housingType = housingTypeSelect.value;
    var housingPrice = housingPriceSelect.value;
    var housingRoom = housingRoomSelect.value;
    var housingGuest = housingGuestSelect.value;
    var filteredPins = pinsData;

    filteredPins = filteredPins.filter(function (pin) {
      return pin.offer.type === housingType ||
        housingType === 'any';
    });

    filteredPins = filteredPins.filter(function (pin) {
      if (housingPrice === 'low') {
        return pin.offer.price < 10000;
      }

      if (housingPrice === 'middle') {
        return pin.offer.price >= 10000 &&
          pin.offer.price <= 50000;
      }

      if (housingPrice === 'high') {
        return pin.offer.price > 50000;
      }
      // housingPrice === 'any'
      return true;
    });

    filteredPins = filteredPins.filter(function (pin) {
      return pin.offer.guests + '' === housingGuest ||
        housingGuest === 'any';
    });

    filteredPins = filteredPins.filter(function (pin) {
      return pin.offer.rooms + '' === housingRoom ||
        housingRoom === 'any';
    });

    featuresInputs.forEach(function (featureInput) {
      filteredPins = filteredPins.filter(function (pin) {
        return !featureInput.checked ||
          pin.offer.features.indexOf(featureInput.value) !== -1;
      });
    });
    filteredPins = filteredPins.slice(0, 5);

    displayPins(filteredPins);
  };
  var reloadPins = debounce(reloadPinsInstant);

  // Нажатие на клавную кнопку и ВХОД В АКТИВНЫЙ РЕЖИМ
  btnActivate.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    mapActivate();
    updateAddress(true);
    reloadPinsInstant();
  });

  btnActivate.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      mapActivate();
      updateAddress(true);
    });
  });

  updateAddress(false);

  // Перемещение метки по карте
  btnActivate.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var mapWidth = document.querySelector('.map__overlay').offsetWidth;
    var maxX = mapWidth - btnActivate.offsetWidth;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var newY = btnActivate.offsetTop - shift.y;
      var newX = btnActivate.offsetLeft - shift.x;
      if (newX > 3 && newX < maxX && newY > 130 && newY < 630) {
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        btnActivate.style.top = newY + 'px';
        btnActivate.style.left = newX + 'px';
        updateAddress();
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Изменение пинов на карте по селектам
  housingTypeSelect.addEventListener('change', reloadPins);
  housingPriceSelect.addEventListener('change', reloadPins);
  housingGuestSelect.addEventListener('change', reloadPins);
  housingRoomSelect.addEventListener('change', reloadPins);
  featuresInputs.forEach(function (featureInput) {
    featureInput.addEventListener('change', reloadPins);
  });

})();
