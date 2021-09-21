import AbstractObserver from '../utils/abstract-observer.js';
import {
  getArrayWithoutElement,
  getIndexById
} from '../utils';

export default class Comments extends AbstractObserver {
  constructor(filmsModel) {
    super();

    this._comments = [];
    this._filmsModel = filmsModel;
  }

  get comments() {
    return this._comments;
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  addComment(updateType, filmToUpdate, updatedComments) {
    this._comments = updatedComments;

    this._filmsModel.addComment(updateType, filmToUpdate, updatedComments);
  }

  deleteComment(updateType, whetherUpdateCommentsModel, filmToUpdate, commentToDeleteId) {
    if (whetherUpdateCommentsModel) {
      const commentIndex = getIndexById(this._comments, commentToDeleteId);

      if (commentIndex === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      this._comments = getArrayWithoutElement(this._comments, commentIndex);
    }

    this._filmsModel.deleteComment(updateType, filmToUpdate, commentToDeleteId);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        id: Number(comment['id']),
        emoji: comment['emotion'],
        text: comment['comment'],
      },
    );

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'id': String(comment.id),
        'emotion': comment.emoji,
        'comment': comment.text,
      },
    );

    delete adaptedComment.emoji;
    delete adaptedComment.text;

    return adaptedComment;
  }
}
