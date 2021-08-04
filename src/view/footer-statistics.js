import { addPluralEnding } from '../utils.js';

export const createFooterStatisticsTemplate = (films) => `<p>${films.length} movie${addPluralEnding(films.length)} inside</p>`;
