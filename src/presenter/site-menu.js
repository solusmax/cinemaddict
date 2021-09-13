import SiteMenuView from '../view/site-menu.js';
import StatsView from '../view/stats.js';
import FiltersPresenter from './filters.js';
import {
  renderElement,
  RenderPosition
} from '../utils';

export default class SiteMenu {
  constructor(siteMenuContainer, statsContainer, filmsListPresenter, filmsModel, filtersModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._statsContainer = statsContainer;

    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;

    this._siteMenuComponent = new SiteMenuView();
    this._statsComponent = null;

    this._filmsListPresenter = filmsListPresenter;
    this._filtersPresenter = null;

    this._handleStatsMenuLinkClick = this._handleStatsMenuLinkClick.bind(this);
  }

  init() {
    this._siteMenuComponent.setStatsMenuLinkClickListener(this._handleStatsMenuLinkClick);
    renderElement(this._siteMenuContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);

    if (!this._filtersPresenter) {
      this._filtersPresenter = new FiltersPresenter(this._siteMenuComponent, this._filtersModel, this._filmsModel, this._filmsListPresenter, this._siteMenuComponent);
      this._filtersPresenter.init();
    }
  }

  // Хэндлеры и колбэки ↓↓↓

  _handleStatsMenuLinkClick() {
    if (this._statsComponent && this._statsComponent.isElementRendered()) {
      return;
    }

    this._siteMenuComponent.toggleStatsMenuLinkActiveState();

    this._siteMenuComponent.saveWindowScrollPosition();

    this._filmsListPresenter.destroy();
    this._filtersModel.setCurrentFilter(null, null);

    this._statsComponent = new StatsView(this._filmsModel.films);
    this._statsComponent.init();
    renderElement(this._statsContainer, this._statsComponent);

    this._siteMenuComponent.restoreWindowScrollPosition();

    this._filtersPresenter.setStatsComponent(this._statsComponent);
  }
}
