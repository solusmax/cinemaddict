export const getArrayWithoutElement = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)];

export const getIndexById = (array, id, isIdDirectly) => array.findIndex((el) => (isIdDirectly ? el : el.id) === id);

export const getPluralEnding = (count) => count !== 1 ? 's' : '';

export const getActivityClass = (isActive, className) => isActive ? className : '';

export const isOnline = () => window.navigator.onLine;
