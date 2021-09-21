import AbstractView from './abstract.js';

const SHOW_MORE_BUTTON_CLASS_NAME = 'films-list__show-more';

const createShowMoreButtonTemplate = () => `<button class="${SHOW_MORE_BUTTON_CLASS_NAME}">Show more</button>`;

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._onClick = this._onClick.bind(this);
  }

  _getTemplate() {
    return createShowMoreButtonTemplate();
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${SHOW_MORE_BUTTON_CLASS_NAME}`));
  }

  setClickListener(cb) {
    this._callback.click = cb;
    this.getElement().addEventListener('click', this._onClick);
  }

  removeClickListener() {
    this.getElement().removeEventListener('click', this._onClick);
  }

  _onClick(evt) {
    evt.preventDefault();

    this._callback.click();
  }
}
