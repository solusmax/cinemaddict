import {
  EMOJIS,
  GENERATED_COMMENTS_COUNT,
  generateComment,
  generateFilm,
  generateFilters,
  generateSortMethods,
  getFilmsSortedByComments,
  getFilmsSortedByRating,
  getUserRank,
  getWatchedFilms
} from './data';
import {
  createFilmCardTemplate,
  createFilmDetailsPopupTemplate,
  createFilmsTemplate,
  createFooterStatisticsTemplate,
  createShowMoreButtonTemplate,
  createSiteMenuTemplate,
  createSortMenuTemplate,
  createUserProfileTemplate
} from './view';
import { getRandomInteger } from './util.js';

const FILMS_COUNT = getRandomInteger(15, 20);
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filmsSortedByComments = getFilmsSortedByComments(films);
const filmsSortedByRating = getFilmsSortedByRating(films);
const comments = new Array(GENERATED_COMMENTS_COUNT).fill().map(() => generateComment());
const filters = generateFilters(films);
const userRank = getUserRank(getWatchedFilms(films).length);

const renderNode = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

const siteHeaderNode = document.querySelector('.header');
const siteFooterNode = document.querySelector('.footer');
const siteMainNode = document.querySelector('.main');

renderNode(siteHeaderNode, createUserProfileTemplate(userRank));
renderNode(siteMainNode, createSiteMenuTemplate(filters));
renderNode(siteMainNode, createSortMenuTemplate(generateSortMethods(films)));
renderNode(siteMainNode, createFilmsTemplate());

const filmsListNode = siteMainNode.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderNode(filmsListContainerNode, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let shownFilmsCount = FILMS_COUNT_PER_STEP;

  renderNode(filmsListNode, createShowMoreButtonTemplate());

  const showMoreButtonNode = filmsListNode.querySelector('.films-list__show-more');

  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();

    films
      .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderNode(filmsListContainerNode, createFilmCardTemplate(film)));

    shownFilmsCount += FILMS_COUNT_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButtonNode.remove();
    }
  };

  showMoreButtonNode.addEventListener('click', onShowMoreButtonClick);
}

const topRatedFilmsListNode = siteMainNode.querySelector('#films-list-top-rated');
const topRatedFilmsListContainerNode = topRatedFilmsListNode.querySelector('.films-list__container');
const mostCommentedFilmsListNode = siteMainNode.querySelector('#films-list-most-commented');
const mostCommentedFilmsListContainerNode = mostCommentedFilmsListNode.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  renderNode(mostCommentedFilmsListContainerNode, createFilmCardTemplate(filmsSortedByComments[i]));
  renderNode(topRatedFilmsListContainerNode, createFilmCardTemplate(filmsSortedByRating[i]));
}

const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

renderNode(footerStatisticsNode, createFooterStatisticsTemplate(films));

renderNode(document.body, createFilmDetailsPopupTemplate(films[0], comments, EMOJIS));
