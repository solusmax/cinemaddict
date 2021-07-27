import {
  createFilmCardTemplate,
  createFilmDetailsPopupTemplate,
  createFilmsTemplate,
  createShowMoreButtonTemplate,
  createSiteMenuTemplate,
  createSortMenuTemplate,
  createUserProfileTemplate
} from './view';

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const renderNode = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');

renderNode(siteHeaderNode, createUserProfileTemplate());
renderNode(siteMainNode, createSiteMenuTemplate());
renderNode(siteMainNode, createSortMenuTemplate());
renderNode(siteMainNode, createFilmsTemplate());

const filmsListNode = siteMainNode.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

for (let i = 0; i < FILMS_COUNT; i++) {
  renderNode(filmsListContainerNode, createFilmCardTemplate());
}

renderNode(filmsListNode, createShowMoreButtonTemplate());

const topRatedFilmsListNode = siteMainNode.querySelector('#films-list-top-rated');
const topRatedFilmsListContainerNode = topRatedFilmsListNode.querySelector('.films-list__container');
const mostCommentedFilmsListNode = siteMainNode.querySelector('#films-list-most-commented');
const mostCommentedFilmsListContainerNode = mostCommentedFilmsListNode.querySelector('.films-list__container');

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  renderNode(mostCommentedFilmsListContainerNode, createFilmCardTemplate());
  renderNode(topRatedFilmsListContainerNode, createFilmCardTemplate());
}

renderNode(document.body, createFilmDetailsPopupTemplate());
