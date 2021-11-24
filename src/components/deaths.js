import AbstractComponent from './abstract-component.js';
import {filterById} from '../utils.js';

export const makeDeathRow = (countryData) => {
  const name = countryData.country;
  const totalDeaths = countryData.totalDeaths.toLocaleString();
  const newDeaths = (+countryData.newDeaths) === 0 ? countryData.newDeaths+"*" : countryData.newDeaths.toLocaleString();
  
  const id = countryData.countryCode;
  const trName = `c-${id}`;
  return (
    `<tr class="${trName}">
    <td class="country__name">Total: <span class="black">${totalDeaths}</span><br>
    Today: <span class="black">${newDeaths}</span>
    </td>
      </td>
    </tr>`
  );
};

export const makeDeathsTableMarkup = (data, filter) => {
  let rows;
  if (filter === "world") {
    const totalDeaths = data.global.totalDeaths;
    const newDeaths = data.global.newDeaths;
    rows =  `<tr>
    <td class="country__name">Total: <span class="black">${totalDeaths.toLocaleString()}</span><br>
    Today: <span class="black">${newDeaths.toLocaleString()}</span>
    </td>
  </tr>`
  } else {
    const dataFiltered = filterById(data, filter);
    const countries = dataFiltered.countries;
    rows = countries.map((item) => makeDeathRow(item)).join('');
  }
  return (
    `<div class="deaths">
    <h3 class="death__header">Deaths</h3>
    <hr class="line-separator">
    <table class="deaths__table">
      ${rows}
    </table>
    </div>`
  );
};

export default class Deaths extends AbstractComponent {

 constructor(data, filter) {
  super();
  this._data = data;
    this._filter = filter;

  }

  getTemplate() {
    return makeDeathsTableMarkup(this._data, this._filter);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener('click', handler);
  }

  recoveryListeners() {
    this.setClickHandler();
  }
}