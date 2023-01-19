import { count } from "d3";

export let mymap = L.map("map");

const coordinatesMap = {};

export const coordinates = (countryData) => {
  // console.log(countryData);
  countryData.forEach((country) => {
    coordinatesMap[country.altSpellings[0]] = [
      country.latlng[0],
      country.latlng[1]
    ];
  });
  // console.log(coordinatesMap);
};

export const changeCoordinates = (filter) => {
  if (filter === "world") {
    mymap.setView([50, 10], 5);
  } else {
    // console.log(filter);
    mymap.setView(coordinatesMap[filter], 5);
  }
};

export default function drawMap(countryData, covidData) {
  // mymap.setView([50, 10], 5);

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
    coordinates(countryData);
    let lat;
    let lng;

    const hasData = Array.isArray(countryData) && countryData.length > 0;
    if (!hasData) return;
    const geoJson = {
      type: "FeatureCollection",
      features: countryData.map((country) => {
        // console.log(country.latlng[0],
        //   country.latlng[1]);
        
        
        // const countryFlag = country.countryInfo.flag;
        // const { countryInfo = {} } = country;
        // const { lat, long: lng } = countryInfo;

        // lat = country.latlng[0];
        // lng = country.latlng[1];

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
      features: countryData.map((country = {}) => {

        // var km = Math.log2(country.cases) * 2 + country.cases / 20000;
        let km = 100;

        var points = 64;
        var coords = {
          latitude: country.latlng[0],
          longitude: country.latlng[1],
        };
        var ret = [];
        var distanceX =
          km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
        var distanceY = km / 110.574;
        var theta, x, y;
        for (var i = 0; i < points; i++) {
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
        let updatedFormatted;
        let casesString;

        const { country, updated, cases, deaths, recovered } = properties;

        const logCases = Math.log2(cases) * 2 + cases / 100000;

        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
        
        const html = `
          <span class="icon-marker" data-country-name="${country}" style="
          width: ${logCases}px;
          height: ${logCases}px;
          transform: translate(-50%, -50%);
          background: radial-gradient(rgb(70, 130, 180, 1),rgb(70, 130, 180,1), rgba(255,0,0,0), rgba(255,0,0,0));
          ">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed cases:</strong> ${cases.toLocaleString()}</li>
                <li><strong>Deaths:</strong> ${deaths.toLocaleString()}</li>
              </ul>
            </span>
            ${casesString}
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

    geoJsonLayerTwo.addTo(mymap);
    geoJsonLayerOne.addTo(mymap);
  }
  getData(countryData);
  mymap.setView([50, 10], 5);

  // coordinates(countryData);//substitude for getData(countryData)
}
