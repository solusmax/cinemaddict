import {
  createRandomUniqueIdGenerator,
  generateRandomText,
  getRandomBoolean,
  getRandomDateFromPast,
  getRandomFloat,
  getRandomInteger,
  getRandomItem,
  getRandomItems
} from '../util.js';

const MAX_FILM_ID = 50;

export const GENERATED_COMMENTS_COUNT = 100;
const MAX_COMMENTS_PER_FILM = 5;

const MIN_SENTENCES_IN_DESCRIPTION = 1;
const MAX_SENTENCES_IN_DESCRIPTION = 5;

const MIN_RATING = 0;
const MAX_RATING = 10;

const MAX_MOVIE_AGE_IN_DAYS = 80 * 365;

const MIN_MOVIE_DURATION_IN_MINUTES = 30;
const MAX_MOVIE_DURATION_IN_MINUTES = 4 * 60;

const MAX_WATCHING_DAYS_AGO = 500;

const POSTERS_PATH = './images/posters';

const POSTER_FILES = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const FILM_TITLES = [
  'Бесславные ублюдки',
  'Бешеные псы',
  'Джанго освобождённый',
  'Криминальное чтиво',
  'Однажды в Голливуде',
  'Омерзительная восьмёрка',
  'Убить Билла',
];

const DIRECTOR_NAMES = [
  'Альфред Хичкок',
  'Джеймс Кэмерон',
  'Джордж Лукас',
  'Дэвид Финчер',
  'Квентин Тарантино',
  'Кристофер Нолан',
  'Стивен Спилберг',
  'Стэнли Кубрик',
];

const ACTOR_NAMES = [
  'Аль Пачино',
  'Брэд Питт',
  'Джонни Депп',
  'Киану Ривз',
  'Леонардо Ди Каприо',
  'Мэттью Макконахи',
  'Роберт Де Ниро',
  'Роберт Паттинсон',
];

const SCREENWRITER_NAMES = [
  'Аарон Соркин',
  'Вуди Аллен',
  'Джонатан Нолан',
  'Мартин Скорсезе',
  'Стивен Спилберг',
  'Фрэнсис Форд Коппола',
  'Чарли Кауфман',
];

const COUNTRIES = [
  'Великобритания',
  'Германия',
  'Индия',
  'Китай',
  'Россия',
  'США',
  'Украина',
  'Франция',
  'Япония',
];

const GENRES = [
  'Боевик',
  'Вестерн',
  'Детектив',
  'Драма',
  'Комедия',
  'Мелодрама',
  'Сказка',
  'Триллер',
  'Ужасы',
];

const AGE_RATINGS = [0, 6, 12, 16, 18];

const getUniqueFilmId = createRandomUniqueIdGenerator(MAX_FILM_ID);

const getRandomRating = () => getRandomFloat(MIN_RATING, MAX_RATING).toFixed(1);

const getRandomListOfCommentsIds = () => new Array(getRandomInteger(0, MAX_COMMENTS_PER_FILM))
  .fill()
  .map(() => getRandomInteger(1, GENERATED_COMMENTS_COUNT));

export const generateFilm = () => ({
  id: getUniqueFilmId(),
  info: {
    poster: `${POSTERS_PATH}/${getRandomItem(POSTER_FILES)}`,
    title: getRandomItem(FILM_TITLES),
    originalTitle: getRandomItem(FILM_TITLES),
    rating: getRandomRating(),
    director: getRandomItem(DIRECTOR_NAMES),
    screenwriters: getRandomItems(SCREENWRITER_NAMES),
    actors: getRandomItems(ACTOR_NAMES),
    releaseDate: getRandomDateFromPast(MAX_MOVIE_AGE_IN_DAYS),
    duration: getRandomInteger(MIN_MOVIE_DURATION_IN_MINUTES, MAX_MOVIE_DURATION_IN_MINUTES),
    releaseCountry: getRandomItem(COUNTRIES),
    genres: getRandomItems(GENRES),
    description: generateRandomText(MIN_SENTENCES_IN_DESCRIPTION, MAX_SENTENCES_IN_DESCRIPTION),
    ageRating: getRandomItem(AGE_RATINGS),
  },
  comments: getRandomListOfCommentsIds(),
  userMeta: {
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    isOnWatchlist: getRandomBoolean(),
    watchingDate: getRandomDateFromPast(MAX_WATCHING_DAYS_AGO),
  },
});
