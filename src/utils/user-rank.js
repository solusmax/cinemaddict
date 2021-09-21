import {
  UserRank,
  UserRankRange
} from '../constants.js';

export const getUserRank = (watchedFilmsCount) => {
  for (const rank of Object.values(UserRank)) {
    if (
      watchedFilmsCount >= UserRankRange[rank][0]
      && watchedFilmsCount <= UserRankRange[rank][1]
    ) {
      return rank;
    }
  }

  return '';
};
