import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsMinMax from 'dayjs/plugin/minMax';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import {
  MINUTES_IN_ONE_DAY,
  RANDOM_SENTENCES
} from './constants.js';

dayjs.extend(dayjsDuration);
dayjs.extend(dayjsMinMax);
dayjs.extend(dayjsRelativeTime);

export const getRandomInteger = (min = 0, max = 1) => {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);

  return Math.floor(Math.random() * (roundedMax - roundedMin + 1) + roundedMin);
};

export const getRandomFloat = (min = 0, max = 1) => {
  const randomNumber = Math.random();

  return Math.min(min + (randomNumber * (max - min + parseFloat(`1e-${(`${randomNumber}`).length - 1}`))), max);
};

export const shuffleArray = (array) => {
  let index = -1;

  while (++index < array.length) {
    const randomNumber = getRandomInteger(index, array.length - 1);
    [array[randomNumber], array[index]] = [array[index], array[randomNumber]];
  }

  return array;
};

export const getRandomItem = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomItems = (array, min = 1, max = array.length) => {
  let randomItems = [];

  while (randomItems.length < min || randomItems.length > max) {
    randomItems = array.filter(() => Math.random() < 0.5);
  }

  return shuffleArray(randomItems);
};

export const getRandomBoolean = () => Boolean(Math.random() < 0.5);

export const generateRandomText = (minSentences = 1, maxSentences = RANDOM_SENTENCES.length) => getRandomItems(RANDOM_SENTENCES, minSentences, maxSentences).join(' ');

export const getRandomDateFromPast = (maxDaysAgo) => dayjs()
  .subtract(getRandomInteger(0, maxDaysAgo - 1), 'day')
  .subtract(getRandomInteger(0, MINUTES_IN_ONE_DAY), 'minute').toISOString();

export const createRandomUniqueIdGenerator = (maxId) => {
  const usedIds = [];

  return () => {
    for (let i = 0; i < maxId; i++) {
      let currentId;

      if (usedIds.length >= maxId) {
        throw new RangeError('Превышен лимит ID.');
      }

      do {
        currentId = getRandomInteger(1, maxId);
      } while (usedIds.includes(currentId));

      usedIds.push(currentId);

      return currentId;
    }
  };
};

export const createConsistentUniqueIdGenerator = () => {
  const usedIds = [];

  return () => {
    const currentId = usedIds.length + 1;

    usedIds.push(currentId);

    return currentId;
  };
};

export const getFormattedDuration = (durationInMinutes) => {
  const duration = dayjs.duration(durationInMinutes, 'minutes');

  return `${duration.hours() ? `${duration.hours()  }h ` : ''}${duration.minutes()}m`;
};

export const addPluralEnding = (count) => count !== 1 ? 's' : '';

export const getMostRecentDate = (...dates) => dayjs.max([...dates.map((date) => dayjs(date))]).toISOString();

export const humanizeFilmDate = (date) => dayjs(date).format('D MMMM YYYY');

export const humanizeCommentDate = (date) => dayjs().to(date);

export const getYearFromDate = (date) => dayjs(date).year();

export const setActiveClass = (activityCondition, className) => activityCondition ? className : '';
