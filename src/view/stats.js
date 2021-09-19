import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartAbstractView from './smart-abstract.js';
import {
  addPluralEnding,
  filter,
  getFilmsWatchedToday,
  getFilmsWatchedWithinWeek,
  getFilmsWatchedWithinMonth,
  getFilmsWatchedWithinYear,
  getSortedGenres,
  getTotalDurationInMinutes,
  getUserRank,
  createElement,
  replaceElement
} from '../utils';
import {
  FilterTypes,
  StatsRanges
} from '../constants.js';

const ClassNames = {
  MAIN: 'statistic',
  STATS_CHART: 'statistic__chart',
  STATS_CHART_WRAPPER: 'statistic__chart-wrap',
  STATS_FILTER_INPUT: 'statistic__filters-input',
  STATS_TEXT_LIST: 'statistic__text-list',
};

const BAR_HEIGHT = 50;

const renderChart = (statisticContext, genres) => {
  const genreTitles = genres.map((genre) => genre[0]);
  const filmsPerGenreCounts = genres.map((genre) => genre[1]);

  return new Chart(statisticContext, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genreTitles,
      datasets: [{
        data: filmsPerGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createUserRankTemplate = (userRank) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>`
);

const createStatsChartTemplate = () => (
  `<div class="${ClassNames.STATS_CHART_WRAPPER}">
    <canvas class="${ClassNames.STATS_CHART}" width="1000"></canvas>
  </div>`
);

const createStatsFiltersTemplate = () => (
  `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="${ClassNames.STATS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" data-stats-range="${StatsRanges.ALL_TIME}" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="${ClassNames.STATS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-today" value="today" data-stats-range="${StatsRanges.TODAY}">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="${ClassNames.STATS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-week" value="week" data-stats-range="${StatsRanges.WEEK}">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="${ClassNames.STATS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-month" value="month" data-stats-range="${StatsRanges.MONTH}">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="${ClassNames.STATS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-year" value="year" data-stats-range="${StatsRanges.YEAR}">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>`
);

const createStatsTextList = (topGenre, totalDurationInMinutes, watchedFilmsCount) => {
  const hours = Math.floor(totalDurationInMinutes / 60);
  const minutes = totalDurationInMinutes - (hours * 60);

  return `<ul class="statistic__text-list">
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
  </ul>`;
};

const createStatsTemplate = (hasMovie, topGenre, totalDurationInMinutes, watchedFilmsCount, userRank) => (
  `<section class="${ClassNames.MAIN}">
    ${createUserRankTemplate(userRank)}

    ${createStatsFiltersTemplate()}

    ${createStatsTextList(topGenre,totalDurationInMinutes,watchedFilmsCount)}

    ${hasMovie ? createStatsChartTemplate() : ''}
  </section>`
);

export default class Stats extends SmartAbstractView {
  constructor(films) {
    super();

    this._films = films;
    this._watchedFilms = this._getWatchedFilms(this._films);

    this._isComponentJustCreated = true;

    this._onStatsFilterInputChange = this._onStatsFilterInputChange.bind(this);
  }

  init() {
    this._hasMovie = Boolean(this._watchedFilms.length);

    this._genres = this._hasMovie ? getSortedGenres(this._watchedFilms) : [];
    this._genresCount = this._genres.length;
    this._topGenre = this._hasMovie ? this._genres[0][0] : '';
    this._watchedFilmsCount = this._watchedFilms.length;
    this._totalDuration = this._hasMovie ? getTotalDurationInMinutes(this._watchedFilms) : 0;
    this._userRank = getUserRank(this._watchedFilmsCount);

    if (this._chart) {
      this._chart.destroy();
    }

    if (this._hasMovie) {
      this._getStatsChartWrapperElement().style.height = `${BAR_HEIGHT * this._genresCount}px`;
      this._getStatsChartElement().height = BAR_HEIGHT * this._genresCount;
      this._chart = renderChart(this._getStatsChartElement(), this._genres);
    }

    if (!this._isComponentJustCreated) {
      this._updateStatsTextListElement();
    } else {
      this._setStatsFilterInputChangeListeners();
      this._isComponentJustCreated = false;
    }
  }

  _getTemplate() {
    return createStatsTemplate(this._hasMovie, this._topGenre, this._totalDuration, this._watchedFilmsCount, this._userRank);
  }

  _getStatsTextListTemplate() {
    return createStatsTextList(this._topGenre, this._totalDuration, this._watchedFilmsCount);
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${ClassNames.MAIN}`));
  }

  _getStatsChartElement() {
    return this.getElement().querySelector(`.${ClassNames.STATS_CHART}`);
  }

  _getStatsChartWrapperElement() {
    return this.getElement().querySelector(`.${ClassNames.STATS_CHART_WRAPPER}`);
  }

  _getStatsFilterInputElements() {
    return this.getElement().querySelectorAll(`.${ClassNames.STATS_FILTER_INPUT}`);
  }

  _getStatsTextListElement() {
    return this.getElement().querySelector(`.${ClassNames.STATS_TEXT_LIST}`);
  }

  _updateStatsTextListElement() {
    const newStatsTextListElement = createElement(this._getStatsTextListTemplate());

    replaceElement(newStatsTextListElement, this._getStatsTextListElement());
  }

  _getWatchedFilms(films) {
    return filter[FilterTypes.HISTORY](films);
  }

  _onStatsFilterInputChange(evt) {
    evt.preventDefault();

    if (!evt.target.checked) {
      return;
    }

    switch (evt.target.dataset.statsRange) {
      case StatsRanges.ALL_TIME:
        this._watchedFilms = this._getWatchedFilms(this._films);
        this.init();
        break;
      case StatsRanges.TODAY:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedToday(this._films));
        this.init();
        break;
      case StatsRanges.WEEK:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinWeek(this._films));
        this.init();
        break;
      case StatsRanges.MONTH:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinMonth(this._films));
        this.init();
        break;
      case StatsRanges.YEAR:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinYear(this._films));
        this.init();
        break;
    }
  }

  _setStatsFilterInputChangeListeners() {
    this._getStatsFilterInputElements().forEach((statsFilterInputElement) => {
      statsFilterInputElement.addEventListener('change', this._onStatsFilterInputChange);
    });
  }
}
