import {
  UserRanks,
  UserRanksRanges
} from '../constants.js';

export const getUserRank = (watchedFilmsCount) => {
  for (const rank of Object.values(UserRanks)) {
    if (watchedFilmsCount >= UserRanksRanges[rank][0] && watchedFilmsCount <= UserRanksRanges[rank][1]) {
      return rank;
    }
  }

  return '';
};

