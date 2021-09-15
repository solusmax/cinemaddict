import AbstractObserver from '../utils/abstract-observer.js';
import {
  findIndexById,
  getArrayWithoutElement
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

  addComment(updateType, [filmToUpdate, {commentText, commentEmoji}]) {
    const newComment = {
      text: commentText,
      emoji: commentEmoji,
    };

    this._comments.push(newComment);

    this._filmsModel.addComment(updateType, filmToUpdate, newComment.id);
  }

  deleteComment(updateType, [filmToUpdate, commentIdToDelete]) {
    const commentIndex = findIndexById(this._comments, commentIdToDelete);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = getArrayWithoutElement(this._comments, commentIndex);

    this._filmsModel.deleteComment(updateType, [filmToUpdate, commentIdToDelete]);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
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
        'emotion': comment.emoji,
        'comment': comment.text,
      },
    );

    delete adaptedComment.comment.emoji;
    delete adaptedComment.comment.text;

    return adaptedComment;
  }
}
