import AbstractComponent from '../abstract-component.js';
import { filterById } from '../../utils.js';
import dailyChart from './daily-chart/daily-chart.js';
import sumChart from './sum-chart/sum-chart.js';
import { json } from 'd3';

import defaultData from '../../assets/covid-data.csv';

const Chart = (countyName) => {
  const currDate = new Date();
  const newCountry = countyName.toLowerCase();

  if (countyName === 'total') {
    const defaultSumData = defaultData.map((d) => {
      const cases = +d[1];
      const date = new Date(d[0]);
      return { cases, date };
    });
    const defaultDailyData = defaultData.map((d) => {
      const cases = +d[2];
      const date = new Date(d[0]);
      return { cases, date };
    });
    sumChart(countyName, defaultSumData);
    dailyChart(countyName, defaultDailyData);
  } else {
    json(
      `https://api.covid19api.com/dayone/country/${newCountry}/status/confirmed`,
    ).then((data) => {
      sumChart(countyName, data);
      dailyChart(countyName, data);
    });
  }
  return ' ';
};

export const getCountryName = (data, filter) => {
  if (filter === 'world') return 'total';
  const dataFiltered = filterById(data, filter);
  const countryData = dataFiltered.countries[0];
  const name = countryData.country;
  return name;
};

export const makeChartsMarkup = (data, filter) => {
  const name = getCountryName(data, filter);
  const markup = Chart(name);
  return markup;
};

export default class Charts extends AbstractComponent {
  constructor(data, filter) {
    super();
    this._data = data;
    this._filter = filter;
  }

  getTemplate() {
    return makeChartsMarkup(this._data, this._filter);
  }
}
