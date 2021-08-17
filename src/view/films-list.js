import AbstractView from './abstract';

const createFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>

    <section class="films-list films-list--extra" id="films-list-top-rated">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
      </div>
    </section>

    <section class="films-list films-list--extra" id="films-list-most-commented">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

const createEmptyFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class FilmsList extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    if (this._filmsCount === 0) {
      return createEmptyFilmsListTemplate();
    }

    return createFilmsListTemplate();
  }
}