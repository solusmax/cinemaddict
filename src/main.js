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
import FilmCardView from './view/film-card.js';
import FilmsListView from './view/films-list.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FullFilmCardView from './view/full-film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import SiteMenuView from './view/site-menu.js';
import SortMenuView from './view/sort-menu.js';
import UserProfileView from './view/user-profile.js';
import {
  getRandomInteger,
  isEscEvent,
  removeElement,
  renderElement
} from './utils';

const FILMS_COUNT = getRandomInteger(15, 20);
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const comments = new Array(GENERATED_COMMENTS_COUNT).fill().map(() => generateComment());
const filters = generateFilters(films);
const userRank = getUserRank(getWatchedFilms(films).length);

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

renderElement(siteHeaderElement, new UserProfileView(userRank));
renderElement(siteMainElement, new SiteMenuView(filters));
renderElement(siteMainElement, new SortMenuView(generateSortMethods(films)));
renderElement(siteMainElement, new FilmsListView(films.length));

const filmsListElement = siteMainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

const fullFilmCardComponent = new FullFilmCardView(films[0], comments, EMOJIS);
let onFullFilmCardEscKeydownWrapper;

const renderFullFilmCard = (film) => {
  const removeFullFilmCard = () => {
    fullFilmCardComponent.removeCloseButtonClickListener();
    window.removeEventListener('keydown', onFullFilmCardEscKeydownWrapper);
    removeElement(fullFilmCardComponent);
    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
  };

  if (fullFilmCardComponent.isElementRendered()) {
    removeFullFilmCard();
  }

  fullFilmCardComponent.setFilm(film);
  renderElement(document.body, fullFilmCardComponent);
  document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);

  const onFullFilmCardEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      removeFullFilmCard();
    }
  };

  onFullFilmCardEscKeydownWrapper = onFullFilmCardEscKeydown;

  fullFilmCardComponent.setCloseButtonClickListener(removeFullFilmCard);
  window.addEventListener('keydown', onFullFilmCardEscKeydownWrapper);
};

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.setTitleClickListener(renderFullFilmCard.bind(null, film));
  filmComponent.setPosterClickListener(renderFullFilmCard.bind(null, film));
  filmComponent.setCommentsLinkClickListener(renderFullFilmCard.bind(null, film));

  renderElement(container, filmComponent);
};

const renderFilmCards = () => {
  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainerElement, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let shownFilmsCount = FILMS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView;

    renderElement(filmsListElement, showMoreButtonComponent);

    showMoreButtonComponent.setClickListener(() => {
      films
        .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(filmsListContainerElement, film));

      shownFilmsCount += FILMS_COUNT_PER_STEP;

      if (shownFilmsCount >= films.length) {
        showMoreButtonComponent.removeClickListener();
        removeElement(showMoreButtonComponent);
      }
    });
  }
};

const renderExtraFilms = () => {
  const filmsSortedByComments = getFilmsSortedByComments(films);
  const filmsSortedByRating = getFilmsSortedByRating(films);

  const topRatedFilmsListElement = siteMainElement.querySelector('#films-list-top-rated');
  const topRatedFilmsListContainerElement = topRatedFilmsListElement.querySelector('.films-list__container');
  const mostCommentedFilmsListElement = siteMainElement.querySelector('#films-list-most-commented');
  const mostCommentedFilmsListContainerElement = mostCommentedFilmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    renderFilmCard(mostCommentedFilmsListContainerElement, filmsSortedByComments[i]);
    renderFilmCard(topRatedFilmsListContainerElement, filmsSortedByRating[i]);
  }
};

if (films.length > 0) {
  renderFilmCards();
  renderExtraFilms();
}

const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length));
