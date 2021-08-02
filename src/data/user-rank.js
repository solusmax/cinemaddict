const userRanks = {
  novice: [1, 10],
  fan: [11, 20],
  movieBuff: [21, Infinity],
};

const userRanksTitles = {
  novice: 'Novice',
  fan: 'Fan',
  movieBuff: 'Movie Buff',
};

export const getUserRank = (watchedFilmsCount) => {
  for (const [rank, range] of Object.entries(userRanks)) {
    if (watchedFilmsCount >= range[0] && watchedFilmsCount <= range[1]) {
      return userRanksTitles[rank];
    }
  }

  return '';
};
