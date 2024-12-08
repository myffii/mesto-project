export { enableValidation, toggleButtonState }

// Функция получает форму и инпут-элемент, проверяет его на валидность
function isValid(formElement, inputElement, settings) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
    inputElement.setCustomValidity("")
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings)
  } else {
    hideInputError(formElement, inputElement, settings)
  }
}

// Стилизация невалидного поля
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); // выбираем span ошибки для своего инпута
  inputElement.classList.add(`${settings.inputErrorClass}`); // подсвечивает сам инпут
  errorElement.classList.add(`${settings.errorClass}`); // сообщение ошибки
  errorElement.textContent = errorMessage; // текст ошибки
}

// Снятие стилей невалидного поля
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(`${settings.inputErrorClass}`); // убираем подсветку с инпута
  errorElement.classList.remove(`${settings.errorClass}`);
  errorElement.textContent = '';
}

// Блокировка кнопки //
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(`${settings.inactiveButtonClass}`);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(`${settings.inactiveButtonClass}`);
    buttonElement.disabled = false;
  }
}

// включение валидации вызовом enableValidation все настройки передаются при вызове
const enableValidation = (settings) => {

  // Выбираем все формы
  const formList = Array.from(document.querySelectorAll(`${settings.formSelector}`))
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  })
}

// Вешаем обработчик события на все инпуты внутри формы
function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(`${settings.inputSelector}`))
  const buttonElement = formElement.querySelector(`${settings.submitButtonSelector}`);
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      isValid(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings)
    })
  })
}

