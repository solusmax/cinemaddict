import {
  EMOJIS,
  GENERATED_COMMENTS_COUNT,
  generateComment,
  generateFilm,
  generateFilters,
  getUserRank,
  getWatchedFilms
} from './data';
import FooterStatisticsView from './view/footer-statistics.js';
import SiteMenuView from './view/site-menu.js';
import UserProfileView from './view/user-profile.js';
import FilmsListPresenter from './presenter/films-list.js';
import {
  getRandomInteger,
  renderElement
} from './utils';

const FILMS_COUNT = getRandomInteger(15, 20);

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const comments = new Array(GENERATED_COMMENTS_COUNT).fill().map(() => generateComment());
const filters = generateFilters(films);
const userRank = getUserRank(getWatchedFilms(films).length);

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

renderElement(siteHeaderElement, new UserProfileView(userRank));
renderElement(siteMainElement, new SiteMenuView(filters));

const filmsListPresenter = new FilmsListPresenter(siteMainElement, films, comments, EMOJIS);
filmsListPresenter.init();

const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length));
