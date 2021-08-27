import AbstractView from './abstract';

const ContainerIds = {
  MAIN: 'films-list-main',
  TOP_RATED: 'films-list-top-rated',
  MOST_COMMENTED: 'films-list-most-commented',
};

const ClassNames = {
  FILMS_LIST:'films-list',
  FILMS_LIST_CONTAINER:'films-list__container',
};

const createMainListInnerTemplate = () => (
  `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

  <div class="${ClassNames.FILMS_LIST_CONTAINER}">
  </div>`
);

const createEmptyMainListInnerTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

const createExtraListsTemplate = () => (
  `<section class="${ClassNames.FILMS_LIST} films-list--extra" id="${ContainerIds.TOP_RATED}">
    <h2 class="films-list__title">Top rated</h2>

    <div class="${ClassNames.FILMS_LIST_CONTAINER}">
    </div>
  </section>

  <section class="${ClassNames.FILMS_LIST} films-list--extra" id="${ContainerIds.MOST_COMMENTED}">
    <h2 class="films-list__title">Most commented</h2>

    <div class="${ClassNames.FILMS_LIST_CONTAINER}">
    </div>
  </section>`
);

const createFilmsListTemplate = (isEmpty) => (
  `<section class="films">
    <section class="${ClassNames.FILMS_LIST}" id="${ContainerIds.MAIN}">
      ${isEmpty ? createEmptyMainListInnerTemplate() : createMainListInnerTemplate()}
    </section>

    ${isEmpty ? '' : createExtraListsTemplate()}
  </section>`
);

export default class FilmsList extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  _getTemplate() {
    return createFilmsListTemplate(this._filmsCount === 0);
  }

  getMainListElement() {
    return this.getElement().querySelector(`#${ContainerIds.MAIN}`);
  }

  getMainListContainerElement() {
    return this.getMainListElement().querySelector(`.${ClassNames.FILMS_LIST_CONTAINER}`);
  }

  getTopRatedListContainerElement() {
    return this.getElement().querySelector(`#${ContainerIds.TOP_RATED} .${ClassNames.FILMS_LIST_CONTAINER}`);
  }

  getMostCommentedListContainerElement() {
    return this.getElement().querySelector(`#${ContainerIds.MOST_COMMENTED} .${ClassNames.FILMS_LIST_CONTAINER}`);
  }
}
