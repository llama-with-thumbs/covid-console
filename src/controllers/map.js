
export let mymap = L.map("map");

const coordinatesMap = {};
export const coordinates = (countryData) => {
  return countryData.forEach((country) => {
    coordinatesMap[country.altSpellings[0]] = [
      country.latlng[0],
      country.latlng[1]
    ];
  });
};

export const changeCoordinates = (filter) => {
  if (filter === "world") {
    // console.log("world");
    mymap.setView([50, 10], 5);
  } else {
    // console.log(filter);
    // console.log("coordinatesMap[filter]", coordinatesMap[filter]);
    mymap.setView(coordinatesMap[filter], 5);
  }
};

export default function drawMap(countryData, covidData, covidOneNineThree) {
  // mymap.setView([50, 10], 5);
  // console.log(covidOneNineThree);
  // console.log(countryData);

  const fullData = () => countryData.map(restCountryApiCountry => {
    const covidOneNineThreeCountry = covidOneNineThree.response.find(({country}) => country === restCountryApiCountry.name.common);
    
    return {
      ...restCountryApiCountry,
      // ...country
      "population": restCountryApiCountry.population,
      "countryName": restCountryApiCountry.name.official,
      "cca2": restCountryApiCountry.cca2,
      "latlng": restCountryApiCountry.latlng,
      "totalConfirmed": typeof covidOneNineThreeCountry === 'undefined' ? 0 : covidOneNineThreeCountry.cases.total,
    };
  })
  // console.log(fullData());

  const data = countryData.map(restCountryApiCountry => {
    const countryCovidData = covidData.countries.find(({ countryCode }) => countryCode === restCountryApiCountry.cca2);
    return {
      ...restCountryApiCountry,
      // ...country
      // "countryName": restCountryApiCountry.name.common,
      "cca2": restCountryApiCountry.cca2,
      "latlng": restCountryApiCountry.latlng,
      "totalConfirmed": typeof countryCovidData === 'undefined' ? 0 : countryCovidData.totalConfirmed
    };

  })

  // console.log(data);

  // console.log(covidData);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94dXNlcmZvcmZyZWUiLCJhIjoiY2xjcWJtaTNpMDRiYzNwazZ6bnJjM3dlZiJ9.okn2pkFIoQAPrMtXDmBxGQ",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "your.mapbox.access.token",
    }
  ).addTo(mymap);

  function getData(countryData) {
    // coordinates(countryData);

    const hasData = Array.isArray(countryData) && countryData.length > 0;
    if (!hasData) return;

    const geoJson = {
      type: "FeatureCollection",
      features: countryData.map((country) => {
        // console.log(country);
        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [country.latlng[1], country.latlng[0]],
          },
        };
      }),
    };

    const geoJsonSecondLayer = {
      type: "FeatureCollection",
      features: data.map((country = {}) => {

        // console.log(Math.log2(country.totalConfirmed) * 2 + country.totalConfirmed / 20000);

        // console.log(country.population);
        // let km = country.totalConfirmed === 0 ? 10 : Math.log2(country.totalConfirmed) * 2 + country.totalConfirmed / 200000;
        let km = country.population === 0 ? 10 : Math.log2(country.population) * 2 + country.population / 500000;
        let points = 64;
        let coords = {
          latitude: country.latlng[0],
          longitude: country.latlng[1],
        };

        let ret = [];
        let distanceX =
          km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
        let distanceY = km / 110.574;
        let theta, x, y;
        for (let i = 0; i < points; i++) {
          theta = (i / points) * (2 * Math.PI);
          x = distanceX * Math.cos(theta);
          y = distanceY * Math.sin(theta);
          ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);

        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Polygon",
            coordinates: [ret],
            stroke: "red",
          },
        };
      }),
    };

    const geoJsonLayerOne = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;

        // console.log(feature);
        // let updatedFormatted;
        // let casesString;

        const countryName = properties.name.common;
        const population = properties.population;
        const totalConfirmed = properties.totalConfirmed;
        const { flags } = properties;

        const logCases = Math.log2(totalConfirmed) * 2 + totalConfirmed / 1000000;

        // casesString = `${cases}`;

        // if (cases > 1000) {
        //   casesString = `${casesString.slice(0, -3)}k+`;
        // }

        // if (updated) {
        //   updatedFormatted = new Date(updated).toLocaleString();
        // }


        const deaths = 0;

        const html = `
          <span class="icon-marker" data-country-name="${countryName}" style="
          width: ${logCases}px;
          height: ${logCases}px;
          transform: translate(-50%, -50%);
          background: radial-gradient(rgb(70, 130, 180, 1),rgb(70, 130, 180,1), rgba(255,0,0,0), rgba(255,0,0,0));
          ">
            <span class="icon-marker-tooltip">
              <h2>${countryName}<img class="county-flag" src="${flags[1]}" height="10" width="15" alt="flag"></h2>
              <ul>
                <li><strong>Population:</strong> ${population.toLocaleString()}</li>
                <li><strong>Total number of cases:</strong> ${totalConfirmed.toLocaleString()}</li>
                <li><strong>Deaths:</strong> ${deaths.toLocaleString()}</li>
              </ul>
            </span>
            <h2>${countryName}<img class="county-flag" src="${flags[1]}" height="10" width="15" alt="flag"></h2>
          </span>
        `;

        return new L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });

    const geoJsonLayerTwo = new L.GeoJSON(geoJsonSecondLayer);

    geoJsonLayerOne.addTo(mymap);

    geoJsonLayerTwo.addTo(mymap);


  }
  getData(data);
  mymap.setView([50, 10], 5);
  coordinates(countryData);
}
