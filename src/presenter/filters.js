import FiltersView from '../view/filters.js';
import {
  filter,
  removeElement,
  renderElement,
  RenderPosition,
  replaceElement
} from '../utils';
import {
  FilterType,
  UpdateType
} from '../constants.js';

export default class Filters {
  constructor(containerElement, filtersModel, filmsModel, filmsListPresenter, siteMenuComponent) {
    this._containerElement = containerElement;

    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._component = null;
    this._siteMenuComponent = siteMenuComponent;
    this._statisticsComponent = null;

    this._filmsListPresenter = filmsListPresenter;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFiltersClick = this._handleFiltersClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  setStatisticsComponent(statisticsComponent) {
    this._statisticsComponent = statisticsComponent;
  }

  init() {
    const filters = this._getFilters();

    const previousComponent = this._component;

    this._component = new FiltersView(filters, this._filtersModel.getCurrentFilter());
    this._component.setFiltersClickListener(this._handleFiltersClick);

    if (!previousComponent) {
      renderElement(this._containerElement, this._component, RenderPosition.AFTERBEGIN);
      return;
    }

    replaceElement(this._component, previousComponent);
    removeElement(previousComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL_FILMS,
        title: 'All movies',
        count: filter[FilterType.ALL_FILMS](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        title: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        title: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        title: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFiltersClick(newFilterType) {
    const previousFilterType = this._filtersModel.getCurrentFilter();

    if (previousFilterType === newFilterType) {
      return;
    }

    if (!previousFilterType) {
      this._siteMenuComponent.toggleStatisticsMenuLinkActiveState();
      removeElement(this._statisticsComponent);

      this._filtersModel.setCurrentFilter(null, newFilterType);
      this._filmsListPresenter.init();

      return;
    }

    this._filtersModel.setCurrentFilter(UpdateType.FILMS_LIST_AND_SORT, newFilterType);
  }
}
