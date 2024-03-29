'use strict';

(function () {
  var MAIN_PIN_TOP_MARGIN = 375;
  var MAIN_PIN_LEFT_MARGIN = 570;
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
  titleInput.addEventListener('change', function () {
    titleInput.checkValidity();
  });


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
  priceInput.addEventListener('change', function () {
    priceInput.checkValidity();
  });


  var hotelTypeSelect = adForm.querySelector('select[name="type"]');

  var setInputParams = function () {
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

  var hotelTypeChangeHandler = function () {
    setInputParams();
  };

  hotelTypeSelect.addEventListener('change', hotelTypeChangeHandler);
  setInputParams();


  var timeInSelect = adForm.querySelector('select[name="timein"]');
  var timeOutSelect = adForm.querySelector('select[name="timeout"]');

  timeInSelect.addEventListener('change', function () {
    timeOutSelect.value = timeInSelect.value;
  });

  timeOutSelect.addEventListener('change', function () {
    timeInSelect.value = timeOutSelect.value;
  });


  var roomsSelect = adForm.querySelector('select[name="rooms"]');
  var capacitySelect = adForm.querySelector('select[name="capacity"]');
  var capacityOption3 = capacitySelect.querySelector('option[value="3"]');
  var capacityOption2 = capacitySelect.querySelector('option[value="2"]');
  var capacityOption1 = capacitySelect.querySelector('option[value="1"]');
  var capacityOption0 = capacitySelect.querySelector('option[value="0"]');

  var setSelectParams = function () {
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

  var roomsSelectChangeHandler = function () {
    setSelectParams();
  };

  roomsSelect.addEventListener('change', roomsSelectChangeHandler);
  setSelectParams();


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


  var mapDeactivate = function () {
    document.querySelector('.map').classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    var adFormDisable = adForm.querySelectorAll('fieldset');
    adFormDisable.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });

    titleInput.value = '';
    priceInput.value = '';

    adForm.querySelector('textarea[name="description"]').value = '';

    var pinsRemove = document.querySelector('.map__pins').querySelectorAll('.map__pin');
    pinsRemove.forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        element.remove();
      }
    });

    var defaultMainPin = document.querySelector('.map__pins').querySelector('.map__pin--main');
    defaultMainPin.style.left = MAIN_PIN_LEFT_MARGIN + 'px';
    defaultMainPin.style.top = MAIN_PIN_TOP_MARGIN + 'px';

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
    window.map.updateAddress();
    window.map.disableFilters();

    setSelectParams();
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
