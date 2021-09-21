import NotificationView from '../view/notification.js';
import { renderElement } from '../utils';

export default class Notification {
  static renderNotification(message, notificationType) {
    const component = new NotificationView(message, notificationType);
    renderElement(document.body, component);
    component.init(component);
  }
}
