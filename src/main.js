import {
  EMOJIS,
  GENERATED_COMMENTS_COUNT,
  generateComment,
  generateFilm,
  getUserRank
} from './data';

import CommentsModel from './model/comments.js';
import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';

import FooterStatisticsView from './view/footer-statistics.js';
import SiteMenuView from './view/site-menu.js';
import UserProfileView from './view/user-profile.js';

import FilmsListPresenter from './presenter/films-list.js';
import FiltersPresenter from './presenter/filters.js';

import {
  filter,
  getRandomInteger,
  renderElement
} from './utils';
import { FilterTypes } from './constants.js';

const FILMS_COUNT = getRandomInteger(15, 20);

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const comments = new Array(GENERATED_COMMENTS_COUNT).fill().map(() => generateComment());

const filmsModel = new FilmsModel();
filmsModel.films = films;

const commentsModel = new CommentsModel(filmsModel);
commentsModel.comments = comments;

const filtersModel = new FiltersModel();

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const siteMenuComponent = new SiteMenuView();

renderElement(siteMainElement, siteMenuComponent);

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filtersModel, EMOJIS);
filmsListPresenter.init();

const filtersPresenter = new FiltersPresenter(siteMenuComponent, filtersModel, filmsModel);
filtersPresenter.init();

const userRank = getUserRank(filter[FilterTypes.HISTORY](filmsModel.films).length);

renderElement(siteHeaderElement, new UserProfileView(userRank));

const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length));
