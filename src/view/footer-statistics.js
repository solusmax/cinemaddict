import { addPluralEnding } from '../util.js';

export const createFooterStatisticsTemplate = (films) => `<p>${films.length} movie${addPluralEnding(films.length)} inside</p>`;
