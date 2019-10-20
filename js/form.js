'use strict';

(function () {
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

})();
