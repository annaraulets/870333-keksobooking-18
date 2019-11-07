'use strict';

window.util = (function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  var showError = function () {
    var errorBlock = document.querySelector('#error').content.querySelector('.error');
    var errorCopy = errorBlock.cloneNode(true);
    var errorButton = errorCopy.querySelector('.error__button');
    var map = document.querySelector('main');

    map.appendChild(errorCopy);

    errorButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      errorCopy.remove();
    });

    document.addEventListener('keydown', function (evt) {
      isEscEvent(evt, function () {
        errorCopy.remove();
      });
    });

    document.addEventListener('click', function () {
      errorCopy.remove();
    });
  };

  return {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    showError: showError
  };
})();
