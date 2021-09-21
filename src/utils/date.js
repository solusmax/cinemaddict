import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import dayjsIsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjsIsToday from 'dayjs/plugin/isToday';
import dayjsMinMax from 'dayjs/plugin/minMax';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(dayjsDuration);
dayjs.extend(dayjsIsBetween);
dayjs.extend(dayjsIsSameOrAfter);
dayjs.extend(dayjsIsToday);
dayjs.extend(dayjsMinMax);
dayjs.extend(dayjsRelativeTime);

export const getFormattedDuration = (durationInMinutes) => {
  const duration = dayjs.duration(durationInMinutes, 'minutes');

  return `${duration.hours() ? `${duration.hours()  }h ` : ''}${duration.minutes()}m`;
};

export const getMostRecentDate = (...dates) => dayjs.max([...dates.map((date) => dayjs(date))]).toISOString();

export const humanizeFilmDate = (date) => dayjs(date).format('D MMMM YYYY');

export const humanizeCommentDate = (date) => dayjs(date).isSameOrAfter(dayjs())
  ? 'now'
  : dayjs(date).fromNow();

export const getYearFromDate = (date) => dayjs(date).year();

export const getCurrentDate = () => dayjs().toISOString();

export const isDateToday = (date) => dayjs(date).isToday();

export const isDateBetweenNowAndWeekAgo = (date) => dayjs(date).isBetween(dayjs(), dayjs().subtract(1, 'week'), null, '[]');

export const isDateBetweenNowAndMonthAgo = (date) => dayjs(date).isBetween(dayjs(), dayjs().subtract(1, 'month'), null, '[]');

export const isDateBetweenNowAndYearAgo = (date) => dayjs(date).isBetween(dayjs(), dayjs().subtract(1, 'year'), null, '[]');
