import ErrorAlertView from '../view/error-alert.js';
import { renderElement } from '../utils';

export default class ErrorAlert {
  static renderErrorAlert(errorMessage, messageDuration) {
    const errorAlertComponent = new ErrorAlertView(errorMessage, messageDuration);
    renderElement(document.body, errorAlertComponent);
    errorAlertComponent.init(errorAlertComponent);
  }
}
