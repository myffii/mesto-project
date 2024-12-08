export { openPopup, closePopup }

//   Закрытие по кнопке ESC
function closeOnEsc(evt) {
  if (evt.key === 'Escape') {
    const currentPopup = document.querySelector('.popup_opened')
    closePopup(currentPopup)
  }
}

//   Удаляем слушатель на закрытие попапов по кнопке ESC
function closePopup(popupElement) {
  popupElement.classList.remove('popup_opened');
  document.removeEventListener('keydown', closeOnEsc)
}

function openPopup(popupElement) {
  popupElement.classList.add('popup_opened');
  document.addEventListener('keydown', closeOnEsc);
}
