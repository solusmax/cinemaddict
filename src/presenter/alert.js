import AlertView from '../view/alert.js';
import { renderElement } from '../utils';

export default class Alert {
  static renderAlert(message, alertType) {
    const alertComponent = new AlertView(message, alertType);
    renderElement(document.body, alertComponent);
    alertComponent.init(alertComponent);
  }
}
