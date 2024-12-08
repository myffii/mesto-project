export { addNewCard, deleteCard, likeCard, deleteLikeCard, editAvatar }

const config = {
  baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
  headers: {
    authorization: 'c332ec78-8188-42ee-a7cb-95156d70b599',
    'Content-Type': 'application/json'
  }
}

const getResponseData = (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}

// GET запрос данных о пользователе
export function getUser() {
  return fetch(`${config.baseUrl}/users/me', {
    headers: config.headers
  })
    .then(getResponseData)
}

// PATCH изменение данных пользователя

export function editProfileInfo(userName, userJob,) {
  return fetch(`${config.baseUrl}/users/me', {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: `${userName}`,
      about: `${userJob}`
    })
  })
    .then(getResponseData)

}

// GET запрос карточек
export function getCards() {
  return fetch(`${config.baseUrl}/cards', {
    headers: config.headers
  })
    .then(getResponseData)
}

// POST Добавление новой карточки
function addNewCard(cardName, cardLink) {
  return fetch(`${config.baseUrl}/cards', {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: `${cardName}`,
      link: `${cardLink}`
    })
  }).then(getResponseData)
}

function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers
  })
    .then(getResponseData)
}

// Поставить лайк
function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
    .then(getResponseData)
}

// Удалить лайк карточки
function deleteLikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(getResponseData)
}

// Обновление аватара
function editAvatar(avatarLink) {
  return fetch(`${config.baseUrl}/users/me/avatar', {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: `${avatarLink}`
    })
  })
    .then(getResponseData)

}
