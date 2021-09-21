import AbstractView from './abstract.js';
import { removeElement } from '../utils';
import { NotificationType } from '../constants.js';

const MESSAGE_DURATION = 3000;

const NOTIFICATION_TITLE_CLASS_NAME = 'notification__title';

const NotificationColor = {
  [NotificationType.ERROR]: '#ad2108',
  [NotificationType.SUCCESS]: '#09834a',
  [NotificationType.WARNING]: '#79770a',
};

const createNotificationTemplate = () => (
  `<section class="notification">
    <h2 class="${NOTIFICATION_TITLE_CLASS_NAME}"></h2>
  </section>`
);

export default class Notification extends AbstractView {
  constructor(message, type = NotificationType.ERROR) {
    super();

    this._message = message;
    this._messageDuration = MESSAGE_DURATION;
    this._type = type;
    this._color = NotificationColor[this._type];
  }

  init(component) {
    this._getNotificationTitleElement().innerText = this._message;
    this.getElement().style.backgroundColor = this._color;

    setTimeout(() => removeElement(component), this._messageDuration);
  }

  _getTemplate() {
    return createNotificationTemplate();
  }

  _getNotificationTitleElement() {
    return this.getElement().querySelector(`.${NOTIFICATION_TITLE_CLASS_NAME}`);
  }
}
