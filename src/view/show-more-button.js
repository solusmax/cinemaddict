import AbstractView from './abstract';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._onClick = this._onClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _onClick(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickListener(cb) {
    this._callback.click = cb;
    this.getElement().addEventListener('click', this._onClick);
  }

  removeClickListener() {
    this.getElement().removeEventListener('click', this._onClick);
  }
}
