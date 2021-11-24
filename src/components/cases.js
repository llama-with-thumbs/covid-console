import AbstractComponent from './abstract-component.js';
import {filterById} from '../utils.js';

export const makeRecRow = (countryData) => {
  const name = countryData.country;
  // console.log(countryData);
  const totalCases = countryData.totalConfirmed.toLocaleString();
  const todayCases = (+countryData.newConfirmed) === 0 ? countryData.newConfirmed+"*" : countryData.newConfirmed.toLocaleString();
  const id = countryData.countryCode;
  const trName = `c-${id}`;
  return (
    `<tr class="${trName}">
      <td class="country__name">Total: <span class="red">${totalCases}</span><br>
      Today: <span class="red">${todayCases}</span>
      </td>
    </tr>`
  );
};

export const makeRecoveriesTableMarkup = (data, filter) => {
  let rows;
  if (filter === "world") {
    const totalConfirmed = data.global.totalConfirmed;
    const newConfirmed = data.global.newConfirmed;
    rows =  `<tr>
    <td class="country__name">Total: <span class="red">${totalConfirmed.toLocaleString()}</span><br>
    Today: <span class="red">${newConfirmed.toLocaleString()}</span>
    </td>
  </tr>`
  } else {
    const dataFiltered = filterById(data, filter);
    const countries = dataFiltered.countries;
    rows = countries.map((item) => makeRecRow(item, filter)).join('');
  }
  return (
    `<div class="recoveries">
      <h3 class="recovered__header">Cases</h3>
      <hr class="line-separator">
      <table class="recov__table">
        ${rows}
      </table>
    </div>`
  );
};

export default class Cases extends AbstractComponent {

 constructor(data, filter) {
  super();
  this._data = data;
  this._filter = filter;
  }

  getTemplate() {
    return makeRecoveriesTableMarkup(this._data, this._filter);
  }

  // setClickHandler(handler) {
  //   this.getElement().addEventListener('click', handler);
  // }

  // recoveryListeners() {
  //   this.setClickHandler();
  // }
}