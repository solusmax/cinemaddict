import AbstractView from './abstract.js';

export default class SmartAbstract extends AbstractView {
  constructor() {
    if (new.target === SmartAbstract) {
      throw new Error('Can\'t instantiate SmartAbstract, only concrete one.');
    }

    super();

    this._data = {};
  }

  _updateData(newData, isElementUpdating) {
    if (!newData) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      newData,
    );

    if (isElementUpdating) {
      this.updateElement();
    }
  }

  updateElement() {
    const previousElement = this.getElement();
    const parentElement = previousElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parentElement.replaceChild(newElement, previousElement);
    this._restoreListeners();
  }

  _restoreListeners() {
    throw new Error('SmartAbstract method not implemented: _restoreListeners');
  }
}
