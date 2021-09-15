export const getArrayWithoutElement = (array, indexToRemove) => [...array.slice(0, indexToRemove), ...array.slice(indexToRemove + 1)];

export const findIndexById = (array, id, isNotProperty) => array.findIndex((el) => (isNotProperty ? Number(el) : Number(el.id)) === Number(id));

export const addPluralEnding = (count) => count !== 1 ? 's' : '';

export const setActiveClass = (activityCondition, className) => activityCondition ? className : '';
