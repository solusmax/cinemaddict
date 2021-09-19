import CommentsModel from './model/comments.js';
import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';

import FooterStatisticsView from './view/footer-statistics.js';

import AlertPresenter from './presenter/alert.js';
import FilmsListPresenter from './presenter/films-list.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import UserRank from './presenter/user-rank.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

import {
  isOnline,
  renderElement
} from './utils';
import {
  AlertMessage,
  AlertType,
  UpdateTypes
} from './constants.js';

const AUTHORIZATION = 'Basic z2kabc24s159dsxC';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const filtersModel = new FiltersModel();

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filtersModel, apiWithProvider);
filmsListPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateTypes.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateTypes.INIT, []);
    AlertPresenter.renderAlert(AlertMessage.ERROR_FILMS_LOADING);
  })
  .finally(() => {
    const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, siteMainElement, filmsListPresenter, filmsModel, filtersModel);
    siteMenuPresenter.init();

    const userRankPresenter = new UserRank(siteHeaderElement, filmsModel);
    userRankPresenter.init();

    const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
    renderElement(footerStatisticsElement, new FooterStatisticsView(filmsModel.getFilms().length));
  });

const reportOffline = () => {
  document.title = `[offline] ${document.title}`;
  AlertPresenter.renderAlert(AlertMessage.OFFLINE_ON, AlertType.WARNING);
};

window.addEventListener('load', () => {
  navigator.serviceWorker.register('sw.js');
});

if (!isOnline()) {
  reportOffline();
}

window.addEventListener('online', () => {
  document.title = document.title.replace('[offline] ', '');
  AlertPresenter.renderAlert(AlertMessage.ONLINE_ON, AlertType.SUCCESS);
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  reportOffline();
});
