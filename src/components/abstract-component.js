import {createElement, remove, replace} from '../utils.js';

// абстрактный компонент, от которого будут наследовать базовые методы все остальные компоненты

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  show() {
    if (this._element && this._element.classList.contains('invisible')) {
      this._element.classList.remove('invisible');
    }
  }

  hide() {
    if (this._element && !this._element.classList.contains('invisible')) {
      this.getElement().classList.add('invisible');
    }
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }
  
  rerender(newElement) {
    const oldElement = this.getElement();
    replace(newElement, oldElement);
    // const parent = oldElement.parentElement;
    // this.removeElement();
    // this.getElement().remove();
    // const newElement = this.getElement();
    // parent.replaceChild(newElement, oldElement);
  }

}
