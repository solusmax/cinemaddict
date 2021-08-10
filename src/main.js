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
import FilmsView from './view/films.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FullFilmCardView from './view/full-film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import SiteMenuView from './view/site-menu.js';
import SortMenuView from './view/sort-menu.js';
import UserProfileView from './view/user-profile.js';
import {
  getRandomInteger,
  renderElement
} from './utils.js';

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

renderElement(siteHeaderElement, new UserProfileView(userRank).getElement());
renderElement(siteMainElement, new SiteMenuView(filters).getElement());
renderElement(siteMainElement, new SortMenuView(generateSortMethods(films)).getElement());
renderElement(siteMainElement, new FilmsView().getElement());

const filmsListElement = siteMainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

const fullFilmCardComponent = new FullFilmCardView(films[0], comments, EMOJIS);

const renderFullFilmCard = (film) => {
  const removeFullFilmCard = () => {
    fullFilmCardComponent.getElement().remove();
    fullFilmCardComponent.removeElement();
    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
  };

  if (fullFilmCardComponent.isElementRendered()) {
    removeFullFilmCard();
  }

  fullFilmCardComponent.setFilm(film);
  renderElement(document.body, fullFilmCardComponent.getElement());
  document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);

  const fullFilmCardCloseButtonElement = fullFilmCardComponent.getElement().querySelector('.film-details__close-btn');

  const onFullFilmCardCloseButtonClick = () => (evt) => {
    evt.preventDefault();
    removeFullFilmCard();
  };

  fullFilmCardCloseButtonElement.addEventListener('click', onFullFilmCardCloseButtonClick());
};

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCardView(film);

  const filmCardPosterElement = filmComponent.getElement().querySelector('.film-card__poster');
  const filmCardTitleElement = filmComponent.getElement().querySelector('.film-card__title');
  const filmCardCommentsLinkElement = filmComponent.getElement().querySelector('.film-card__comments');

  const onfilmCardTitleClick = () => {
    renderFullFilmCard(film);
  };

  const onfilmCardPosterClick = () => {
    renderFullFilmCard(film);
  };

  const onfilmCardCommentsLinkClick = () => (evt) => {
    evt.preventDefault();
    renderFullFilmCard(film);
  };

  filmCardTitleElement.addEventListener('click', onfilmCardTitleClick);
  filmCardPosterElement.addEventListener('click', onfilmCardPosterClick);
  filmCardCommentsLinkElement.addEventListener('click', onfilmCardCommentsLinkClick());

  renderElement(container, filmComponent.getElement());
};

const renderFilmCards = () => {
  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainerElement, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let shownFilmsCount = FILMS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView;

    renderElement(filmsListElement, showMoreButtonComponent.getElement());

    const onShowMoreButtonClick = (evt) => {
      evt.preventDefault();

      films
        .slice(shownFilmsCount, shownFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(filmsListContainerElement, film));

      shownFilmsCount += FILMS_COUNT_PER_STEP;

      if (shownFilmsCount >= films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    };

    showMoreButtonComponent.getElement().addEventListener('click', onShowMoreButtonClick);
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

renderFilmCards();
renderExtraFilms();

const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length).getElement());
