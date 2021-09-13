import SmartAbstractView from './smart-abstract.js';
import {
  addPluralEnding,
  filter,
  getSortedGenres,
  getTotalDurationInMinutes,
  getUserRank
} from '../utils';
import { FilterTypes } from '../constants.js';

const STATISTIC_CLASS_NAME = 'statistic';

const createUserRankTemplate = (userRank) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>`
);

const createStatsChartTemplate = () => (
  `<div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>`
);

const createStatsFiltersTemplate = () => (
  `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>`
);

const createStatsTemplate = (hasMovie, topGenre, totalDurationInMinutes, watchedFilmsCount, userRank) => {
  const hours = Math.floor(totalDurationInMinutes / 60);
  const minutes = totalDurationInMinutes - (hours * 60);

  return `<section class="${STATISTIC_CLASS_NAME}">
    ${hasMovie ? createUserRankTemplate(userRank) : ''}

    ${hasMovie ? createStatsFiltersTemplate() : ''}

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movie${addPluralEnding(watchedFilmsCount)}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    ${hasMovie ? createStatsChartTemplate() : ''}
  </section>`;
};

export default class Stats extends SmartAbstractView {
  constructor(films) {
    super();

    this._watchedFilms = filter[FilterTypes.HISTORY](films);

    this._hasMovie = Boolean(this._watchedFilms.length);

    this._genres = this._hasMovie
      ? getSortedGenres(this._watchedFilms)
      : [];
    this._topGenre = this._hasMovie
      ? this._genres[0][0]
      : '';
    this._totalDuration = this._hasMovie
      ? getTotalDurationInMinutes(this._watchedFilms)
      : 0;
    this._watchedFilmsCount = this._watchedFilms.length;
    this._userRank = getUserRank(this._watchedFilmsCount);
  }

  _getTemplate() {
    return createStatsTemplate(this._hasMovie, this._topGenre, this._totalDuration, this._watchedFilmsCount, this._userRank);
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${STATISTIC_CLASS_NAME}`));
  }
}
