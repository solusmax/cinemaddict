import AbstractView from './abstract.js';

const STATISTICS_MENU_LINK_ID = 'statistics-link';

const ADDITIONAL_CONTROL_ACTIVE_STATE_CLASS_NAME = 'main-navigation__additional--active';

const createSiteMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" id="${STATISTICS_MENU_LINK_ID}" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._onStatisticsMenuLinkClick = this._onStatisticsMenuLinkClick.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate();
  }

  _getStatisticsMenuLinkElement() {
    return this.getElement().querySelector(`#${STATISTICS_MENU_LINK_ID}`);
  }

  saveWindowScrollPosition() {
    this._windowScrollPosition = window.scrollY;
  }

  restoreWindowScrollPosition() {
    window.scrollTo({ top: this._windowScrollPosition });
  }

  toggleStatisticsMenuLinkActiveState() {
    this._getStatisticsMenuLinkElement().classList.toggle(ADDITIONAL_CONTROL_ACTIVE_STATE_CLASS_NAME);
  }

  setStatisticsMenuLinkClickListener(cb) {
    this._callback.statisticsMenuLinkClick = cb;
    this._getStatisticsMenuLinkElement().addEventListener('click', this._onStatisticsMenuLinkClick);
  }

  _onStatisticsMenuLinkClick(evt) {
    evt.preventDefault();

    this._callback.statisticsMenuLinkClick();
  }
}
