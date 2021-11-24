export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
    case RenderPosition.BEFOREBEGIN:
      container.before(component.getElement());
      break;
  }
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const isExistElements = !!(parentElement && newElement && oldElement);
  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export const remove = (component) => {
  component.getElement().remove();
};

export const filterByCountry = (data, filter) => {
  if (filter === null) return data;
  let result = {};
  result.global = data.global;
  let countriesArray = data.countries;
  let filtered = countriesArray.filter((item) => item.country === filter);
  result.countries = filtered;
  return result;
};

export const filterById = (data, filter) => {
  if (filter === null) return data;
  let result = {};
  result.global = data.global;
  let countriesArray = data.countries;
  let filtered = countriesArray.filter((item) => item.countryCode === filter);
  result.countries = filtered;
  return result;
};

export const firstLetterToLowerCase = (str) => {
  return str[0].toLowerCase() + str.slice(1);
};

export const renameObjKeys = (obj) => {
  for (let key in obj) {
    if (typeof key === 'string') {
      obj[firstLetterToLowerCase(key)] = obj[key];
      delete obj[key];
    }
  }
};
