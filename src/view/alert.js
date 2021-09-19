import AbstractView from './abstract.js';
import { removeElement } from '../utils';
import { AlertType } from '../constants.js';

const MESSAGE_DURATION = 3000;

const AlertColor = {
  [AlertType.ERROR]: '#ad2108',
  [AlertType.SUCCESS]: '#09834a',
  [AlertType.WARNING]: '#79770a',
};

const ALERT_TITLE_CLASS_NAME = 'alert__title';

const createAlertTemplate = () => (
  `<section class="alert">
    <h2 class="${ALERT_TITLE_CLASS_NAME}"></h2>
  </section>`
);

export default class Alert extends AbstractView {
  constructor(message, alertType = AlertType.ERROR) {
    super();

    this._message = message;
    this._alertType = alertType;
    this._alertColor = AlertColor[this._alertType];
    this._messageDuration = MESSAGE_DURATION;
  }

  init(component) {
    this._getAlertTitleElement().innerText = this._message;
    this.getElement().style.backgroundColor = this._alertColor;

    setTimeout(() => removeElement(component), this._messageDuration);
  }

  _getTemplate() {
    return createAlertTemplate();
  }

  _getAlertTitleElement() {
    return this.getElement().querySelector(`.${ALERT_TITLE_CLASS_NAME}`);
  }
}
