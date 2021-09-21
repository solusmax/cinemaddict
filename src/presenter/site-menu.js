import SiteMenuView from '../view/site-menu.js';
import StatisticsView from '../view/statistics.js';
import FiltersPresenter from './filters.js';
import {
  removeElement,
  renderElement,
  RenderPosition
} from '../utils';

export default class SiteMenu {
  constructor(containerElement, statisticsContainerElement, filmsListPresenter, filmsModel, filtersModel) {
    this._containerElement = containerElement;
    this._statisticsContainerElement = statisticsContainerElement;

    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;

    this._component = new SiteMenuView();
    this._statisticsComponent = null;

    this._filmsListPresenter = filmsListPresenter;
    this._filtersPresenter = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleStatisticsMenuLinkClick = this._handleStatisticsMenuLinkClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._component.setStatisticsMenuLinkClickListener(this._handleStatisticsMenuLinkClick);
    renderElement(this._containerElement, this._component, RenderPosition.AFTERBEGIN);

    if (!this._filtersPresenter) {
      this._filtersPresenter = new FiltersPresenter(this._component, this._filtersModel, this._filmsModel, this._filmsListPresenter, this._component);
      this._filtersPresenter.init();
    }
  }

  _renderStatistics(isFirstOpen) {
    this._component.saveWindowScrollPosition();

    if (!isFirstOpen) {
      removeElement(this._statisticsComponent);
    } else {
      this._filmsListPresenter.destroy();
    }

    this._filtersModel.setCurrentFilter(null, null);

    this._statisticsComponent = new StatisticsView(this._filmsModel.getFilms());
    this._statisticsComponent.init();
    renderElement(this._statisticsContainerElement, this._statisticsComponent);

    this._component.restoreWindowScrollPosition();

    this._filtersPresenter.setStatisticsComponent(this._statisticsComponent);
  }

  _handleModelEvent() {
    if (this._statisticsComponent && this._statisticsComponent.isElementRendered()) {
      this._renderStatistics(false);
    }
  }

  _handleStatisticsMenuLinkClick() {
    if (this._statisticsComponent && this._statisticsComponent.isElementRendered()) {
      return;
    }

    this._component.toggleStatisticsMenuLinkActiveState();

    this._renderStatistics(true);
  }
}
