'use strict';

window.map = (function () {

  var HOTEL_TYPES_DICT = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var DEBOUNCE_INTERVAL = 500;
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var PIN_OFFSET_NOTACTIVE = 25;
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var LEFT_MARGIN = -PIN_OFFSET_X;
  var TOP_MARGIN = 130 - PIN_OFFSET_Y;
  var BOTTOM_MARGIN = 630 - PIN_OFFSET_Y;

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

    facilities.forEach(function (facility) {
      if (pin.offer.features.indexOf(facility) === -1) {
        cardElement.querySelector('.popup__feature--' + facility).remove();
      }
    });

    cardElement.querySelector('.popup__description').textContent = pin.offer.description;

    var photoTemplate = cardTemplate.querySelector('.popup__photo');
    var photoFragment = document.createDocumentFragment();

    pin.offer.photos.forEach(function (photo) {
      var photoElement = photoTemplate.cloneNode(true);
      photoElement.src = photo;
      photoFragment.appendChild(photoElement);
    });

    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(photoFragment);


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

  var addCardElement = function (pin) {
    closeCardElement();
    document.querySelector('.map').insertBefore(
        renderCardElement(pin),
        document.querySelector('.map__filters-container')
    );
  };


  document.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, closeCardElement);
  });


  var closeCardElement = function () {
    var cardElement = document.querySelector('.map').querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
    }
  };

  var filtersForm = document.querySelector('.map .map__filters');
  var housingTypeSelect = filtersForm.querySelector('select[name="housing-type"]');
  var housingPriceSelect = filtersForm.querySelector('select[name="housing-price"]');
  var housingRoomSelect = filtersForm.querySelector('select[name="housing-rooms"]');
  var housingGuestSelect = filtersForm.querySelector('select[name="housing-guests"]');
  var featuresInputs = filtersForm.querySelectorAll('.map__features input[name="features"]');


  var renderPinElement = function (pin) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = (pin.location.x - PIN_OFFSET_X) + 'px';
    pinElement.style.top = (pin.location.y - PIN_OFFSET_Y) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;


    pinElement.addEventListener('click', function () {
      addCardElement(pin);
    });

    pinElement.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, function () {
        addCardElement(pin);
      });
    });

    return pinElement;
  };


  var displayPins = function (pins) {
    var fragment = document.createDocumentFragment();

    pins.forEach(function (pin) {
      var pinElement = renderPinElement(pin);
      fragment.appendChild(pinElement);
    });

    var pinsListElement = document.querySelector('.map__pins');

    var pinsRemove = pinsListElement.querySelectorAll('.map__pin');

    pinsRemove.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });

    pinsListElement.appendChild(fragment);
  };


  var setDisable = function (element) {
    element.setAttribute('disabled', 'disabled');
  };
  var removeDisable = function (element) {
    element.removeAttribute('disabled');
  };


  var mapFiltersForm = document.querySelector('.map__filters');
  var disableFilters = function () {
    mapFiltersForm.querySelectorAll('select').forEach(setDisable);
    mapFiltersForm.querySelectorAll('fieldset').forEach(setDisable);
  };
  disableFilters();

  var enableFilters = function () {
    mapFiltersForm.querySelectorAll('select').forEach(removeDisable);
    mapFiltersForm.querySelectorAll('fieldset').forEach(removeDisable);
  };


  var pinsData;
  window.backend.load(function (response) {
    pinsData = response;
    if (isMapActive()) {
      reloadPinsInstant();
      enableFilters();
    }
  }, window.util.showError
  );


  var adForm = document.querySelector('.notice').querySelector('.ad-form');
  var adFormDisable = adForm.querySelectorAll('fieldset');
  adFormDisable.forEach(setDisable);

  var isMapActive = function () {
    return !document.querySelector('.map').classList.contains('map--faded');
  };

  var mapActivate = function () {
    document.querySelector('.map').classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    adFormDisable.forEach(removeDisable);
    if (pinsData) {
      enableFilters();
    }
  };

  var btnActivate = document.querySelector('.map__pins').querySelector('.map__pin--main');


  var removePx = function (numberWithPx) {
    return parseInt(numberWithPx.slice(0, numberWithPx.length - 2), 10);
  };


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
    if (!pinsData) {
      return;
    }

    closeCardElement();
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
        return pin.offer.price < MIN_PRICE;
      }

      if (housingPrice === 'middle') {
        return pin.offer.price >= MIN_PRICE &&
          pin.offer.price <= MAX_PRICE;
      }

      if (housingPrice === 'high') {
        return pin.offer.price > MAX_PRICE;
      }

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
      reloadPinsInstant();
    });
  });

  updateAddress(false);


  btnActivate.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var mapWidth = document.querySelector('.map__overlay').offsetWidth;
    var maxX = mapWidth - btnActivate.offsetWidth + PIN_OFFSET_X;
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

      if (newX >= LEFT_MARGIN && newX < maxX) {
        startCoords.x = moveEvt.clientX;
        btnActivate.style.left = newX + 'px';
      }

      if (newY >= TOP_MARGIN && newY < BOTTOM_MARGIN) {
        startCoords.y = moveEvt.clientY;
        btnActivate.style.top = newY + 'px';
      }

      updateAddress(true);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  housingTypeSelect.addEventListener('change', reloadPins);
  housingPriceSelect.addEventListener('change', reloadPins);
  housingGuestSelect.addEventListener('change', reloadPins);
  housingRoomSelect.addEventListener('change', reloadPins);
  featuresInputs.forEach(function (featureInput) {
    featureInput.addEventListener('change', reloadPins);
  });

  return {
    closeCardElement: closeCardElement,
    updateAddress: updateAddress,
    disableFilters: disableFilters
  };
})();
