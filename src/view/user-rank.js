import AbstractView from './abstract.js';

const createUserRankTemplate = (userRank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRank extends AbstractView {
  constructor(userRank) {
    super();

    this._userRank = userRank;
  }

  _getTemplate() {
    return createUserRankTemplate(this._userRank);
  }
}
