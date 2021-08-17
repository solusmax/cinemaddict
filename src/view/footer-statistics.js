import {
  addPluralEnding,
  createElement
} from '../utils';

const createFooterStatisticsTemplate = (filmsCount) => `<p>${filmsCount} movie${addPluralEnding(filmsCount)} inside</p>`;

export default class FooterStatistics {
  constructor(filmsCount) {
    this._element = null;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
