import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const renderElement = (container, element, position = RenderPosition.BEFOREEND) => {
  let currentContainer = container;
  let currentElement = element;

  if (container instanceof Abstract) {
    currentContainer = container.getElement();
  }

  if (element instanceof Abstract) {
    currentElement = element.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      currentContainer.prepend(currentElement);
      break;
    case RenderPosition.BEFOREEND:
      currentContainer.append(currentElement);
      break;
  }
};

export const removeElement = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
