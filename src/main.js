import CommentsModel from './model/comments.js';
import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsListPresenter from './presenter/films-list.js';
import NotificationPresenter from './presenter/notification.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import UserRank from './presenter/user-rank.js';
import Api from './api/api.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import {
  isOnline,
  renderElement,
  reportOffline,
  reportOnline
} from './utils';
import {
  NotificationMessage,
  UpdateType
} from './constants.js';

const AUTHORIZATION = 'Basic z2kabc24s159dsxC';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const STORE_PREFIX = 'cinemaddict-1483111-localstorage';
const STORE_VERSION = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const filtersModel = new FiltersModel();

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filtersModel, apiWithProvider);
const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, siteMainElement, filmsListPresenter, filmsModel, filtersModel);
const userRankPresenter = new UserRank(siteHeaderElement, filmsModel);

filmsListPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    NotificationPresenter.renderNotification(NotificationMessage.ERROR_FILMS_LOADING);
  })
  .finally(() => {
    siteMenuPresenter.init();
    userRankPresenter.init();

    renderElement(footerStatisticsElement, new FooterStatisticsView(filmsModel.getFilms().length));
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('sw.js');
});

if (!isOnline()) {
  reportOffline();
}

window.addEventListener('online', () => {
  reportOnline();
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  reportOffline();
});
