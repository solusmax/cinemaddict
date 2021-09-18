import SmartAbstractView from './smart-abstract.js';
import {
  FilmCardStateType,
  ViewStateValue
} from '../constants.js';

export default class AbstractFilmCard extends SmartAbstractView {
  constructor(film) {
    super();

    if (new.target === AbstractFilmCard) {
      throw new Error('Can\'t instantiate AbstractFilmCard, only concrete one.');
    }

    this._film = film;
    this._filmId = this._film.id;
    this._data = this._getDefaultData();

    this._onAddToWatchlistButtonClick = this._onAddToWatchlistButtonClick.bind(this);
    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onMarkAsFavoriteButtonClick = this._onMarkAsFavoriteButtonClick.bind(this);
  }

  get filmId() {
    return this._filmId;
  }

  set filmId(id) {
    this._filmId = id;
  }

  _getDefaultData() {
    return Object.assign(
      {},
      this._film,
      {
        viewState: Object.assign({}, this._getDefaultViewStateStructure()),
      },
    );
  }

  _getDefaultViewStateStructure() {
    return {
      [FilmCardStateType.META_UPDATING]: ViewStateValue.NO_PROCESSING,
    };
  }

  setViewState(stateType, updatedState, isElementUpdating) {
    const newData = stateType && updatedState
      ? {
        viewState: Object.assign(
          {},
          this._data.viewState,
          {
            [stateType]: updatedState,
          },
        ),
      }
      : {};

    this._updateData(newData, isElementUpdating);
  }

  // Геттеры элементов ↓↓↓

  _getAddToWatchlistButtonElement() {
    throw new Error('AbstractFilmCard method not implemented: _getAddToWatchlistButtonElement');
  }

  _getMarkAsWatchedButtonElement() {
    throw new Error('AbstractFilmCard method not implemented: _getMarkAsWatchedButtonElement');
  }

  _getMarkAsFavoriteButtonElement() {
    throw new Error('AbstractFilmCard method not implemented: _getMarkAsFavoriteButtonElement');
  }

  // Колбэки листенеров ↓↓↓

  _onAddToWatchlistButtonClick(evt) {
    evt.preventDefault();

    this._callback.addToWatchlistButtonClick();
  }

  _onMarkAsWatchedButtonClick(evt) {
    evt.preventDefault();

    this._callback.markAsWatchedButtonClick();
  }

  _onMarkAsFavoriteButtonClick(evt) {
    evt.preventDefault();

    this._callback.markAsFavoriteButtonClick();
  }

  // Сеттеры листенеров ↓↓↓

  setAddToWatchlistButtonClickListener(cb) {
    this._callback.addToWatchlistButtonClick = cb;
    this._getAddToWatchlistButtonElement().addEventListener('click', this._onAddToWatchlistButtonClick);
  }

  setMarkAsWatchedButtonClickListener(cb) {
    this._callback.markAsWatchedButtonClick = cb;
    this._getMarkAsWatchedButtonElement().addEventListener('click', this._onMarkAsWatchedButtonClick);
  }

  setMarkAsFavoriteButtonClickListener(cb) {
    this._callback.markAsFavoriteButtonClick = cb;
    this._getMarkAsFavoriteButtonElement().addEventListener('click', this._onMarkAsFavoriteButtonClick);
  }

  // Удаляторы листенеров ↓↓↓

  removeAddToWatchlistButtonClickListener() {
    this._getAddToWatchlistButtonElement().removeEventListener('click', this._onAddToWatchlistButtonClick);
  }

  removeMarkAsWatchedButtonClickListener() {
    this._getMarkAsWatchedButtonElement().removeEventListener('click', this._onMarkAsWatchedButtonClick);
  }

  removeMarkAsFavoriteButtonClickListener() {
    this._getMarkAsFavoriteButtonElement().removeEventListener('click', this._onMarkAsFavoriteButtonClick);
  }
}
