import AbstractView from './abstract';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButton extends AbstractView {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}
