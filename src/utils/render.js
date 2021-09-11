import Abstract from '../view/abstract.js';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
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
    case RenderPosition.BEFOREBEGIN:
      currentContainer.before(currentElement);
      break;
    case RenderPosition.AFTERBEGIN:
      currentContainer.prepend(currentElement);
      break;
    case RenderPosition.BEFOREEND:
      currentContainer.append(currentElement);
      break;
    case RenderPosition.AFTEREND:
      currentContainer.after(currentElement);
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
  let currentNewChild = newChild;
  let currentOldChild = oldChild;

  if (currentNewChild instanceof Abstract) {
    currentNewChild = currentNewChild.getElement();
  }

  if (currentOldChild instanceof Abstract) {
    currentOldChild = currentOldChild.getElement();
  }

  const parent = currentOldChild.parentElement;

  if (parent === null || currentNewChild === null || currentOldChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(currentNewChild, currentOldChild);
};
