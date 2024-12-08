// импорт стилей для вебпака
import '../pages/index.css'

// Импорт модулей
import { createCard, renderCard } from './card.js';
import { closePopup, openPopup } from './modal.js';
import { enableValidation, toggleButtonState } from './validate.js';
import { check, getCards, getUser, editProfileInfo, addNewCard, editAvatar } from './api.js'
export { clickLargeImage, renderUserInfo, renderLoading, settings }

// Закрытие попапов по оверлею
const popupList = document.querySelectorAll('.popup') // выбираем все попапы

// Все крестики - кнопки закрытия
const btnClosePopupList = document.querySelectorAll('.popup__close-button')

//Кнопки открытия попапа
// - редактирования профиля
const btnOpenEditProfile = document.querySelector('.profile__edit-button')

// - добавления карточек
const btnOpenNewCardPopup = document.querySelector('.profile__add-button')

// - добавления карточек
const btnOpenAvatarPopup = document.querySelector('.profile__avatar-button')

// Форма добавления карточки
const formAddCard = document.querySelector('.popup__input-container_type_add'); // выбираем форму добавления карточки

// Инпуты новой карточки
const cardName = document.querySelector('.popup__text-input_type_card-name'); // выбираем инпут для названия карточки
const cardSrc = document.querySelector('.popup__text-input_type_link') // выбираем инпут для линка картинки
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__description')

// Кнопка добавить место
const popupNewCard = document.querySelector('.popup_type_add_card') // для класса popup__opened

// Редактирования профиля
const popupEditProfile = document.querySelector('.popup_type_edit-profile')
const formEditProfile = document.querySelector('.popup__input-container_type_profile')
const nameInput = formEditProfile.querySelector('.popup__text-input_type_name')
const jobInput = formEditProfile.querySelector('.popup__text-input_type_description')
const profileAvatar = document.querySelector('.profile__avatar');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const formEditAvatar = document.querySelector('.popup__input-container_type_avatar') // форма изменения аватара
const avatarInput = formEditAvatar.querySelector('.popup__text-input_type_avatar') // инпут аватара

// Попап с картинкой
const imagePopupForm = document.querySelector('.popup_type_image');
const popupLabel = imagePopupForm.querySelector('.popup__label');
const largeImage = document.querySelector('.popup__image');

const settings = {
  formSelector: ".popup__input-container",
  inputSelector: '.popup__text-input',
  submitButtonSelector: '.popup__submit',
  inactiveButtonClass: 'popup__submit_inactive',
  inputErrorClass: 'popup__text-input_type_error',
  errorClass: 'popup__input-error_active'
}

enableValidation(settings)

Promise.all([getCards(), getUser()]) //в Promise.all передаем массив промисов которые нужно выполнить
  .then(([cardsInfo, userInfo]) => {    //попадаем сюда, когда оба промиса будут выполнены, деструктурируем ответ
    renderUserInfo(userInfo)
    cardsInfo.reverse().forEach(card => {
      renderCard(createCard(card, userInfo))
    });
  })
  .catch((err) => {
    console.log(`Ошибка ${err}`);
  })

// ФУНКЦИИ
// Отрисовка состояния загрузки
function renderLoading(evt, text) {
  const btn = evt.target.querySelector('.popup__submit')
  btn.textContent = text
}

// Открыть попап с картинкой
function clickLargeImage(cardSrcValue, cardNameValue) {
  openPopup(imagePopupForm);
  largeImage.src = cardSrcValue;
  largeImage.alt = cardNameValue;
  popupLabel.textContent = cardNameValue
}

// Кнопка "Создать" - добавить место
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(evt, 'Создание...');
  addNewCard(cardName.value, cardSrc.value)
    .then((card) => {
      renderCard(createCard(card, userData));
    })
    .then(() => {
      closePopup(popupNewCard);
      formAddCard.reset();
      const cardFormInputs = Array.from(evt.srcElement.querySelectorAll('.popup__text-input'))
      toggleButtonState(cardFormInputs, evt.submitter, settings)
    })
    .catch(res => console.log(`Ошибка при добавлении новой карточки: ${res.status}`))
    .finally(() => {
      renderLoading(evt, 'Создать')
    })
}

// Кнопка сохранить - информация о пользователе
function handleFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(evt, 'Сохранение...')
  editProfileInfo(`${nameInput.value}`, `${jobInput.value}`, evt)
    .then((res) => {
      renderUserInfo(res, evt);
    })
    .then(() => {
      closePopup(popupEditProfile);
      formAddCard.reset();
      evt.submitter.classList.add('popup__submit_inactive');
      evt.submitter.disabled = true;
    })
    .catch((res) => {
      console.log(`Ошибка при обновлении информации о пользователе: ${res.status}`)
    })
    .finally(() => {
      renderLoading(evt, 'Сохранить')
    })
}

let userData

// Отрисовка информации о пользователе
function renderUserInfo(userInfo) {
  profileAvatar.src = userInfo.avatar;
  profileName.textContent = userInfo.name;
  profileJob.textContent = userInfo.about;
  userData = userInfo
}

// Кнопка сохранить - аватар
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(evt, 'Сохранение...')
  editAvatar(avatarInput.value, evt)
    .then((res) => {
      renderUserInfo(res)
      closePopup(popupEditAvatar)
      formEditAvatar.reset();
      evt.submitter.classList.add('popup__submit_inactive');
      evt.submitter.disabled = true;
    })
    .catch(() => console.log('Ошибка при обновлении аватара'))
    .finally(() => {
      renderLoading(evt, 'Сохранить')
    })
}

// СЛУШАТЕЛИ НА САБМИТ ФОРМ

//__Слушатель - аватар
formEditAvatar.addEventListener('submit', handleAvatarSubmit)

//__Слушатель -  добавление карточек
formAddCard.addEventListener('submit', handleCardFormSubmit)

//__Слушатель - редактирование профиля
formEditProfile.addEventListener('submit', handleFormSubmit);


// СЛУШАТЕЛИ НА ПОПАПЫ
//__ Слушатель - аватар
btnOpenAvatarPopup.addEventListener('click', () => {
  openPopup(popupEditAvatar)
})

//__ Слушатель - попап редактирования профиля
btnOpenEditProfile.addEventListener('click', function () {
  openPopup(popupEditProfile)
  nameInput.value = profileName.textContent
  jobInput.value = profileJob.textContent
});

//__Слушатель - открыть попап добавления карточек
btnOpenNewCardPopup.addEventListener('click', function () {
  openPopup(popupNewCard)
})

// Закрытие всех попапов
//   Слушатель закрытия попапа по клику на крестик
btnClosePopupList.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => {
    closePopup(popup)
  })
})

//   Закрытие по клику на оверлей
popupList.forEach((item) => {
  item.addEventListener('mousedown', function (evt) {
    if (evt.target.classList.contains('popup')) {
      closePopup(evt.target)
    }
  })
})


