import AbstractView from './abstract.js';

const STATS_MENU_LINK_ID = 'stats-link';

const ADDITIONAL_CONTROL_ACTIVE_STATE_CLASS_NAME = 'main-navigation__additional--active';

const createSiteMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" id="${STATS_MENU_LINK_ID}" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._onStatsMenuLinkClick = this._onStatsMenuLinkClick.bind(this);
  }

  _getTemplate() {
    return createSiteMenuTemplate();
  }

  _getStatsMenuLinkElement() {
    return this.getElement().querySelector(`#${STATS_MENU_LINK_ID}`);
  }

  saveWindowScrollPosition() {
    this._windowScrollPosition = window.scrollY;
  }

  restoreWindowScrollPosition() {
    window.scrollTo({top: this._windowScrollPosition});
  }

  toggleStatsMenuLinkActiveState() {
    this._getStatsMenuLinkElement().classList.toggle(ADDITIONAL_CONTROL_ACTIVE_STATE_CLASS_NAME);
  }

  _onStatsMenuLinkClick(evt) {
    evt.preventDefault();

    this._callback.statsMenuLinkClick();
  }

  setStatsMenuLinkClickListener(cb) {
    this._callback.statsMenuLinkClick = cb;
    this._getStatsMenuLinkElement().addEventListener('click', this._onStatsMenuLinkClick);
  }
}
