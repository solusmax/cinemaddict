export default class AbstractObserver {
  constructor() {
    if (new.target === AbstractObserver) {
      throw new Error('Can\'t instantiate AbstractObserver, only concrete one.');
    }

    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
