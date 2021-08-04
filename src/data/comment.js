import {
  createConsistentUniqueIdGenerator,
  generateRandomText,
  getRandomDateFromPast,
  getRandomItem
} from '../utils.js';

const MAX_COMMENT_DAYS_AGO = 500;

const COMMENT_AUTHORS_NAMES = [
  'Джон Грирсон',
  'Дэйв Кер',
  'Майкл Аткинсон',
  'Марк Ефимович Зак',
  'Мел Гуссоу',
  'Михаэль Ханеке',
  'Полин Кейл',
  'Роджер Эберт',
  'Франсуа Трюффо',
];

export const EMOJIS = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const getUniqueCommentId = createConsistentUniqueIdGenerator();

export const generateComment = () => ({
  id: getUniqueCommentId(),
  text: generateRandomText(),
  emoji: getRandomItem(EMOJIS),
  author: getRandomItem(COMMENT_AUTHORS_NAMES),
  date: getRandomDateFromPast(MAX_COMMENT_DAYS_AGO),
});
