import Abstract from '../view/abstract.js';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderElement = (container, element, position = RenderPosition.BEFOREEND) => {
  let containerElement = container;
  let currentElement = element;

  if (containerElement instanceof Abstract) {
    containerElement = containerElement.getElement();
  }

  if (currentElement instanceof Abstract) {
    currentElement = currentElement.getElement();
  }

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      containerElement.before(currentElement);
      break;
    case RenderPosition.AFTERBEGIN:
      containerElement.prepend(currentElement);
      break;
    case RenderPosition.BEFOREEND:
      containerElement.append(currentElement);
      break;
    case RenderPosition.AFTEREND:
      containerElement.after(currentElement);
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

export const replaceElement = (newChild, oldChild) => {
  let newChildElement = newChild;
  let oldChildElement = oldChild;

  if (newChildElement instanceof Abstract) {
    newChildElement = newChildElement.getElement();
  }

  if (oldChildElement instanceof Abstract) {
    oldChildElement = oldChildElement.getElement();
  }

  const parentElement = oldChildElement.parentElement;

  if (!parentElement || !newChildElement || !oldChildElement) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parentElement.replaceChild(newChildElement, oldChildElement);
};
