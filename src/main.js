import CommentsModel from './model/comments.js';
import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';

import FooterStatisticsView from './view/footer-statistics.js';

import ErrorAlertPresenter from './presenter/error-alert.js';
import FilmsListPresenter from './presenter/films-list.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import UserRank from './presenter/user-rank.js';

import Api from './api.js';
import { renderElement } from './utils';
import {
  ErrorMessage,
  UpdateTypes
} from './constants.js';

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const AUTHORIZATION = 'Basic zvkYVbSWMVj9dPmC';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const filtersModel = new FiltersModel();

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filtersModel, api);
filmsListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateTypes.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateTypes.INIT, []);
    ErrorAlertPresenter.renderErrorAlert(ErrorMessage.FILMS_LOADING);
  })
  .finally(() => {
    const siteMenuPresenter = new SiteMenuPresenter(siteMainElement, siteMainElement, filmsListPresenter, filmsModel, filtersModel);
    siteMenuPresenter.init();

    const userRankPresenter = new UserRank(siteHeaderElement, filmsModel);
    userRankPresenter.init();

    const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
    renderElement(footerStatisticsElement, new FooterStatisticsView(filmsModel.getFilms().length));
  });
