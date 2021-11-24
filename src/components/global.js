import AbstractComponent from './abstract-component.js';
import {filterById} from '../utils.js';

export const makeGlobalMarkup = (data, filter) => {
  let sum = 0;
  let todaySum = 0;
  let region = 'Worldwide';
  if (filter === "world") {
    sum = data.global.totalConfirmed;
    todaySum = data.global.newConfirmed.toLocaleString();
  } else {
    const countryData = filterById(data, filter);
    sum = countryData.countries[0].totalConfirmed;
    todaySum = countryData.countries[0].newConfirmed.toLocaleString();
    region = countryData.countries[0].country;
  }
  return (
    `<div class="global_cases">
      <h2>${region}</h2>
      <hr class="line-separator">
      <h4>Total Cases</h4>
      <hr class="line-separator">
      <h2 class="global_cases__number">${sum.toLocaleString()}</h2>
    </div>`
  );
};

export default class Global extends AbstractComponent {

  constructor(data, filter) {
    super();
    this._data = data;
    this._filter = filter;
  }

  getTemplate() {
    return makeGlobalMarkup(this._data, this._filter);
  }

}