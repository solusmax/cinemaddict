import AbstractView from './abstract.js';
import { addPluralEnding } from '../utils';

const createFooterStatisticsTemplate = (filmsCount) => `<p>${filmsCount} movie${addPluralEnding(filmsCount)} inside</p>`;

export default class FooterStatistics extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  _getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }
}
