import { RANDOM_SENTENCES } from '../constants.js';

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

export const getArrayWithoutElement = (array, indexToRemove) => [...array.slice(0, indexToRemove), ...array.slice(indexToRemove + 1)];

export const findIndexById = (array, id, isNotProperty) => array.findIndex((el) => (isNotProperty ? el : el.id) === id);

export const addPluralEnding = (count) => count !== 1 ? 's' : '';

export const setActiveClass = (activityCondition, className) => activityCondition ? className : '';
