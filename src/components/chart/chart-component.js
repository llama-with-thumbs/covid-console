import AbstractComponent from '../abstract-component.js';
import { filterById } from '../../utils.js';
import dailyChart from './daily-chart/daily-chart.js';
import sumChart from './sum-chart/sum-chart.js';
import { json } from 'd3';

import './chart.styles.scss';

import defaultData from '../../assets/covid-data.csv';

const Chart = (countyName) => {
  const currDate = new Date();
  const newCountry = countyName.toLowerCase();
  const charts = document.querySelector('.charts');

  const openFirstTab = () => {
    console.log('first');
    return;
    const tabName = 'first-chart-tab';
    const chartTabs = document.querySelector('chart-tabs');
    for (let i = 0; i < chartTabs.length; i++) {
      chartTabs[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
  };

  const openSecondTab = () => {
    console.log('second');
    return;
    const tabName = 'second-chart-tab';
    const chartTabs = document.querySelector('chart-tabs');
    for (let i = 0; i < chartTabs.length; i++) {
      chartTabs[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
  };

  charts.innerHTML = `
  <div class="chart-bar">
    <button>First chart tab</button>
    <button>Second chart tab</button>
  </div>
  
  <div class="chart-tabs">
    <div class="chart-tab" id="first-chart-tab"></div>
      <div class="sum-chart"></div>
      <div class="daily-chart"></div>
    <div class="chart-tab" id="second-chart-tab" style="display: none;"></div>
  </div>`;

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
