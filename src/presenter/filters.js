import FiltersView from '../view/filters.js';
import {
  FilterTypes,
  UpdateTypes
} from '../constants.js';
import {
  filter,
  removeElement,
  renderElement,
  RenderPosition,
  replaceElement
} from '../utils';

export default class Filters {
  constructor(filtersContainer, filtersModel, filmsModel, filmsListPresenter, siteMenuComponent) {
    this._filtersContainer = filtersContainer;

    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._filtersComponent = null;
    this._siteMenuComponent = siteMenuComponent;
    this._statsComponent = null;

    this._filmsListPresenter = filmsListPresenter;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFiltersClick = this._handleFiltersClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();

    const previousFiltersComponent = this._filtersComponent;

    this._filtersComponent = new FiltersView(filters, this._filtersModel.getCurrentFilter());
    this._filtersComponent.setFiltersClickListener(this._handleFiltersClick);

    if (previousFiltersComponent === null) {
      renderElement(this._filtersContainer, this._filtersComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replaceElement(this._filtersComponent, previousFiltersComponent);
    removeElement(previousFiltersComponent);
  }

  _getFilters() {
    const films = this._filmsModel.films;

    return [
      {
        type: FilterTypes.ALL_FILMS,
        title: 'All movies',
        count: filter[FilterTypes.ALL_FILMS](films).length,
      },
      {
        type: FilterTypes.WATCHLIST,
        title: 'Watchlist',
        count: filter[FilterTypes.WATCHLIST](films).length,
      },
      {
        type: FilterTypes.HISTORY,
        title: 'History',
        count: filter[FilterTypes.HISTORY](films).length,
      },
      {
        type: FilterTypes.FAVORITES,
        title: 'Favorites',
        count: filter[FilterTypes.FAVORITES](films).length,
      },
    ];
  }

  setStatsComponent(statsComponent) {
    this._statsComponent = statsComponent;
  }

  // Хэндлеры и колбэки ↓↓↓

  _handleModelEvent() {
    this.init();
  }

  _handleFiltersClick(newFilterType) {
    const previousFilterType = this._filtersModel.getCurrentFilter();

    if (previousFilterType === newFilterType) {
      return;
    }

    if (!previousFilterType) {
      this._siteMenuComponent.toggleStatsMenuLinkActiveState();
      removeElement(this._statsComponent);

      this._filtersModel.setCurrentFilter(null, newFilterType);
      this._filmsListPresenter.init();

      return;
    }

    this._filtersModel.setCurrentFilter(UpdateTypes.FILMS_LIST_AND_SORT, newFilterType);
  }
}
