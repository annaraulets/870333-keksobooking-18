'use strict';

(function () {
  var PIN_OFFSET_X = 25;
  // Валидация поля Заголовка
  var adForm = document.querySelector('.notice').querySelector('.ad-form');
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


  var showSuccess = function () {
    var successBlock = document.querySelector('#success').content.querySelector('.success');
    var successCopy = successBlock.cloneNode(true);

    document.querySelector('body').appendChild(successCopy);

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, function () {
        successCopy.remove();
      });
    });

    document.addEventListener('click', function () {
      successCopy.remove();
    });
  };

  // ДЕАКТИВИРОВАНИЕ СТРАНИЦЫ
  var mapDeactivate = function () {
    document.querySelector('.map').classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    var adFormDisable = adForm.querySelectorAll('fieldset');
    for (var i = 0; i < adFormDisable.length; i++) {
      adFormDisable[i].setAttribute('disabled', 'disabled');
    }

    titleInput.value = '';
    priceInput.value = '';

    adForm.querySelector('textarea[name="description"]').value = '';

    var pinsRemove = document.querySelector('.map__pins').querySelectorAll('.map__pin');
    for (i = 0; i < pinsRemove.length; i++) {
      if (!pinsRemove[i].classList.contains('map__pin--main')) {
        pinsRemove[i].remove();
      }
    }

    var mapWidth = document.querySelector('.map__overlay').offsetWidth;
    var defaultMainPin = document.querySelector('.map__pins').querySelector('.map__pin--main');
    defaultMainPin.style.left = ((mapWidth / 2) - PIN_OFFSET_X) + 'px';
    defaultMainPin.style.top = '375px';

    var resetSelect = function (select) {
      select.value = select.querySelector('option[selected]').value;
    };
    var resetCheckbox = function (input) {
      input.checked = false;
    };

    document.querySelectorAll('.map__filters select').forEach(resetSelect);
    document.querySelectorAll('.map__filters input[type="checkbox"]').forEach(resetCheckbox);
    adForm.querySelectorAll('select').forEach(resetSelect);
    adForm.querySelectorAll('input[type="checkbox"]').forEach(resetCheckbox);
    window.map.closeCardElement();
  };


  adForm.addEventListener('submit', function (evt) {
    window.backend.save(
        new FormData(adForm),
        function (_response) {
          showSuccess();
        },
        window.util.showError
    );
    evt.preventDefault();
    mapDeactivate();
  });

  var resetButton = adForm.querySelector('.ad-form__reset');

  resetButton.addEventListener('click', function () {
    mapDeactivate();
  });

})();
