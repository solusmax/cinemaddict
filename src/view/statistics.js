import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartAbstractView from './smart-abstract.js';
import {
  createElement,
  filter,
  getFilmsWatchedToday,
  getFilmsWatchedWithinN,
  getPluralEnding,
  getSortedGenres,
  getTotalDurationInMinutes,
  getUserRank,
  replaceElement
} from '../utils';
import {
  CalendarUnit,
  FilterType,
  StatisticsRange
} from '../constants.js';

const CHART_BAR_HEIGHT = 50;

const ClassName = {
  MAIN: 'statistic',
  STATISTICS_CHART: 'statistic__chart',
  STATISTICS_CHART_WRAPPER: 'statistic__chart-wrap',
  STATISTICS_FILTER_INPUT: 'statistic__filters-input',
  STATISTICS_TEXT_LIST: 'statistic__text-list',
};

const renderChart = (statisticsContext, genres) => {
  const genreTitles = genres.map((genre) => genre[0]);
  const filmsPerGenreCounts = genres.map((genre) => genre[1]);

  return new Chart(statisticsContext, {
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

const createStatisticsChartTemplate = () => (
  `<div class="${ClassName.STATISTICS_CHART_WRAPPER}">
    <canvas class="${ClassName.STATISTICS_CHART}" width="1000"></canvas>
  </div>`
);

const createStatisticsFiltersTemplate = () => (
  `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="${ClassName.STATISTICS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" data-statistics-range="${StatisticsRange.ALL_TIME}" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="${ClassName.STATISTICS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-today" value="today" data-statistics-range="${StatisticsRange.TODAY}">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="${ClassName.STATISTICS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-week" value="week" data-statistics-range="${StatisticsRange.WEEK}">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="${ClassName.STATISTICS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-month" value="month" data-statistics-range="${StatisticsRange.MONTH}">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="${ClassName.STATISTICS_FILTER_INPUT} visually-hidden" name="statistic-filter" id="statistic-year" value="year" data-statistics-range="${StatisticsRange.YEAR}">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>`
);

const createStatisticsTextList = (topGenre, totalDurationInMinutes, watchedFilmsCount) => {
  const hours = Math.floor(totalDurationInMinutes / 60);
  const minutes = totalDurationInMinutes - (hours * 60);
  const hasTopGenre = Boolean(topGenre);

  return `<ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movie${getPluralEnding(watchedFilmsCount)}</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
    </li>
    ${hasTopGenre ? `<li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>` : ''}
    </ul>`;
};

const createStatisticsTemplate = (hasFilm, topGenre, totalDurationInMinutes, watchedFilmsCount, userRank) => (
  `<section class="${ClassName.MAIN}">
    ${hasFilm ? createUserRankTemplate(userRank) : ''}

    ${hasFilm ? createStatisticsFiltersTemplate() : ''}

    ${createStatisticsTextList(topGenre, totalDurationInMinutes, watchedFilmsCount)}

    ${hasFilm ? createStatisticsChartTemplate() : ''}
  </section>`
);

export default class Statistics extends SmartAbstractView {
  constructor(films) {
    super();

    this._films = films;
    this._watchedFilms = this._getWatchedFilms(this._films);

    this._isComponentJustCreated = true;

    this._onStatisticsFilterInputChange = this._onStatisticsFilterInputChange.bind(this);
  }

  init() {
    this._hasFilm = Boolean(this._watchedFilms.length);

    this._genres = this._hasFilm ? getSortedGenres(this._watchedFilms) : [];
    this._genresCount = this._genres.length;
    this._topGenre = this._hasFilm ? this._genres[0][0] : '';
    this._watchedFilmsCount = this._watchedFilms.length;
    this._totalDuration = this._hasFilm ? getTotalDurationInMinutes(this._watchedFilms) : 0;
    this._userRank = getUserRank(this._watchedFilmsCount);

    if (this._chart) {
      this._chart.destroy();
    }

    if (this._hasFilm) {
      this._getStatisticsChartWrapperElement().style.height = `${CHART_BAR_HEIGHT * this._genresCount}px`;
      this._getStatisticsChartElement().height = CHART_BAR_HEIGHT * this._genresCount;
      this._chart = renderChart(this._getStatisticsChartElement(), this._genres);
    }

    if (!this._isComponentJustCreated) {
      this._updateStatisticsTextListElement();
    } else {
      this._setStatisticsFilterInputChangeListeners();
      this._isComponentJustCreated = false;
    }
  }

  _getTemplate() {
    return createStatisticsTemplate(this._hasFilm, this._topGenre, this._totalDuration, this._watchedFilmsCount, this._userRank);
  }

  _getStatisticsTextListTemplate() {
    return createStatisticsTextList(this._topGenre, this._totalDuration, this._watchedFilmsCount);
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${ClassName.MAIN}`));
  }

  _getStatisticsChartElement() {
    return this.getElement().querySelector(`.${ClassName.STATISTICS_CHART}`);
  }

  _getStatisticsChartWrapperElement() {
    return this.getElement().querySelector(`.${ClassName.STATISTICS_CHART_WRAPPER}`);
  }

  _getStatisticsFilterInputElements() {
    return this.getElement().querySelectorAll(`.${ClassName.STATISTICS_FILTER_INPUT}`);
  }

  _getStatisticsTextListElement() {
    return this.getElement().querySelector(`.${ClassName.STATISTICS_TEXT_LIST}`);
  }

  _updateStatisticsTextListElement() {
    const newStatisticsTextListElement = createElement(this._getStatisticsTextListTemplate());

    replaceElement(newStatisticsTextListElement, this._getStatisticsTextListElement());
  }

  _getWatchedFilms(films) {
    return filter[FilterType.HISTORY](films);
  }

  _setStatisticsFilterInputChangeListeners() {
    this._getStatisticsFilterInputElements().forEach((statisticsFilterInputElement) => {
      statisticsFilterInputElement.addEventListener('change', this._onStatisticsFilterInputChange);
    });
  }

  _onStatisticsFilterInputChange(evt) {
    evt.preventDefault();

    if (!evt.target.checked) {
      return;
    }

    switch (evt.target.dataset.statisticsRange) {
      case StatisticsRange.ALL_TIME:
        this._watchedFilms = this._getWatchedFilms(this._films);
        break;
      case StatisticsRange.TODAY:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedToday(this._films));
        break;
      case StatisticsRange.WEEK:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinN(this._films, CalendarUnit.WEEK));
        break;
      case StatisticsRange.MONTH:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinN(this._films, CalendarUnit.MONTH));
        break;
      case StatisticsRange.YEAR:
        this._watchedFilms = this._getWatchedFilms(getFilmsWatchedWithinN(this._films, CalendarUnit.YEAR));
        break;
    }

    this.init();
  }
}
