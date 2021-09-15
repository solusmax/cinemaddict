import AbstractView from './abstract.js';
import { removeElement } from '../utils';

const ERROR_MESSAGE_DURATION = 3000;

const ERROR_ALERT_TITLE_CLASS_NAME = 'error-alert__title';

const createErrorAlertTemplate = () => (
  `<section class="error-alert">
    <h2 class="${ERROR_ALERT_TITLE_CLASS_NAME}"></h2>
  </section>`
);

export default class ErrorAlert extends AbstractView {
  constructor(message) {
    super();

    this._message = message;
    this._errorMessageDuration = ERROR_MESSAGE_DURATION;
  }

  init(component) {
    this._getErrorAlertTitleElement().innerText = this._message;

    setTimeout(() => removeElement(component), this._errorMessageDuration);
  }

  _getTemplate() {
    return createErrorAlertTemplate();
  }

  _getErrorAlertTitleElement() {
    return this.getElement().querySelector(`.${ERROR_ALERT_TITLE_CLASS_NAME}`);
  }
}
