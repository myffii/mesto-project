import { clickLargeImage } from "./index.js";
import { getCards, deleteCard, likeCard, deleteLikeCard } from './api.js'
export { createCard, clickLikeCard, renderCard, updateLikeCounter }

// Добавление новых карточек
const cardsContainer = document.querySelector('.cards-grid');
const userTemplate = document.querySelector('#card-template').content; // выбираем темплейт

// создание новых карточек
function createCard(cardsInfo, userInfo) {
  const cardElement = userTemplate.querySelector('.place').cloneNode(true); //клонируем див внутри него со всем содержимым
  const cardElementPhoto = cardElement.querySelector('.place__photo'); // картинка как элемент карточки
  const btnLike = cardElement.querySelector('.place__like-button');
  const counterLikes = cardElement.querySelector('.place__like-counter')

  // Кнопка удаления только под своими карточками
  if (userInfo._id === cardsInfo.owner._id) {
    cardElement.querySelector('.place__delete-button').addEventListener('click', (event) => clickDeleteCard(event, cardsInfo._id)) // слушатель на кнопку удаления карточки
  } else {
    const btnDelete = cardElement.querySelector('.place__delete-button')
    btnDelete.remove()
  }

  cardElement.querySelector('.place__like-counter').textContent = cardsInfo.likes.length;
  cardElement.querySelector('.place__name').textContent = cardsInfo.name; //подставляем название места из инпута
  cardElementPhoto.src = cardsInfo.link; // подставляем ссылку из инпута
  cardElementPhoto.alt = cardsInfo.name // альтернативный текст если на загрузится
  cardElementPhoto.addEventListener('click', function () { clickLargeImage(cardsInfo.link, cardsInfo.name) }) // слушатель на картинку для открытия попапа - передаем ему 2 аргумента

  btnLike.addEventListener('click', (event) => clickLikeCard(event, cardsInfo._id, counterLikes)) // Слушатель на кнопку лайк

  // Отрисуем сердечки если уже лайкали раньше
  cardsInfo.likes.forEach(element => {
    if (element._id === userInfo._id) {
      btnLike.classList.add('place__like-button_active')
    }
  })
  return cardElement
}

// отображение новых карточек в DOM
function renderCard(card) {
  cardsContainer.prepend(card); // вставляем наш контейнер с названием и ссылкой в начало блока карточек
}

// Функция коллбэк для слушателя на кнопке удалить.
function clickDeleteCard(event, cardId) {
  deleteCard(cardId)
    .then(() => { event.target.closest('.place').remove() })
    .catch((res) => console.log(res))
}

// Кнопка лайк.
function clickLikeCard(event, cardId, counterLikes) {
  if (event.target.classList.contains('place__like-button_active')) {
    deleteLikeCard(cardId)
      .then((res) => {
        updateLikeCounter(res, counterLikes)
        event.target.classList.remove('place__like-button_active')
      })
      .catch((res) => console.log(res))
  } else {
    likeCard(cardId)
      .then((res) => {
        updateLikeCounter(res, counterLikes)
        event.target.classList.add('place__like-button_active')
      })
      .catch((res) => console.log(res))
  }
}

function updateLikeCounter(res, counterLikes) {
  counterLikes.textContent = res.likes.length
}
