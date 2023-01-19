import { renameObjKeys } from './utils.js';
import UpdatedController from './controllers/updated.js';
import CountriesController from './controllers/countries.js';
import CovidModel from './models/covid.js';
import drawMap from './controllers/map.js';
import {footer} from './components/footer/footer.component';

import './styles/style.css';

const END_POINT = `https://api.covid19api.com`;
const main = document.querySelector('#main');

const covidModel = new CovidModel();
const loadData = () => {
  fetch(`${END_POINT}/summary`)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      const covidData = JSON.parse(text);
      
      // console.log(covidData);
      
      renameObjKeys(covidData);
      renameObjKeys(covidData.global);
      covidData.countries.map((item) => renameObjKeys(item));
      covidModel.setData(covidData);
      const updated = new UpdatedController(main, covidModel);
      const countries = new CountriesController(main, covidModel);
      updated.render();
      countries.render();

      loadMapData(covidData);

    });
};

const loadMapData = (covidData) => {
  


  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6add2943cbmsh1fd6db18b662239p1893f1jsn42443cb6bdda',
      'X-RapidAPI-Host': 'rest-country-api.p.rapidapi.com'
    }
  };
  
  fetch('https://rest-country-api.p.rapidapi.com/', options)
    .then(countryData => countryData.json())
    .then(countryData => {
      drawMap(countryData, covidData);
      // console.log(countryData);
      // countryData.forEach( country => {
      //         console.log(country);
      //       });
    })
    .catch(err => console.error(err));

  // fetch(`https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     // drawMap(data);
  //     console.log(data)
  //     data.forEach( country => {
  //       console.log(country);
  //     });
  //   });
};

// const cpiaData = () =>
//   fetch('../public/assets/CPIA.json').then((res) => res.json());

// const getCpia = (country) => {
//   // console.log(cpiaData());
//   // cpiaData.forEach((country) => {
//   //   console.log(country);
//   // });
// };

// getCpia();

document.querySelector(".footer").innerHTML = footer;

loadData();
