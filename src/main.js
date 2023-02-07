import { renameObjKeys } from './utils.js';
import UpdatedController from './controllers/updated.js';
import CountriesController from './controllers/countries.js';
import CovidModel from './models/covid.js';
import drawMap from './controllers/map.js';
import { footer } from './components/footer/footer.component';

import './styles/style.css';

const END_POINT = `https://api.covid19api.com`;
const main = document.querySelector('#main');

const covidModel = new CovidModel();

const loadCovidData = () => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6add2943cbmsh1fd6db18b662239p1893f1jsn42443cb6bdda',
      'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
  };

  fetch('https://covid-193.p.rapidapi.com/statistics', options)
    .then(response => response.json())
    .then(response => loadData(response))
    .catch(err => console.error("Oh... new covid data fuck", err));
}
  
const loadData = (covidOneNineThree) => {
  fetch(`${END_POINT}/summary`)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      const covidData = JSON.parse(text);
      renameObjKeys(covidData);
      renameObjKeys(covidData.global);
      covidData.countries.map((item) => renameObjKeys(item));
      covidModel.setData(covidData);
      const updated = new UpdatedController(main, covidModel);
      const countries = new CountriesController(main, covidModel);
      updated.render();
      countries.render();

      loadMap(covidData, covidOneNineThree);
    })
    .catch(err => console.error("fuck, covid data...", err));
};




const loadMap = (covidData, covidOneNineThree) => {

  const countriesData = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6add2943cbmsh1fd6db18b662239p1893f1jsn42443cb6bdda',
      'X-RapidAPI-Host': 'rest-country-api.p.rapidapi.com'
    }
  };

  fetch('https://rest-country-api.p.rapidapi.com/', countriesData)
    .then(response => response.json())
    .then(restCountryApi => {
      drawMap(restCountryApi, covidData, covidOneNineThree);
    })
    .catch(err => console.error("country data fuck...", err));
};

document.querySelector(".footer").innerHTML = footer;

loadCovidData();
