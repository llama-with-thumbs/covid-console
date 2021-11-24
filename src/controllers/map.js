export let mymap = L.map("map");

const coordinatesMap = {};

export const coordinates = (data) => {
  // console.log(data);
  data.forEach((country) => {
    coordinatesMap[country.countryInfo.iso2] = [
      country.countryInfo.lat,
      country.countryInfo.long,
    ];
  });
  // console.log(coordinatesMap);
};
export const changeCoordinates = (filter) => {
  if (filter === "world") {
    mymap.setView([50, 10], 5);
  } else {
    mymap.setView(coordinatesMap[filter], 5);
  }
};

export default function drawMap(data) {
  // mymap.setView([50, 10], 5);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmFkaW5la2hpcyIsImEiOiJja2loZGticTMwNzJxMnltbGRsdzRqZmw0In0.E8fOw826aYb03PGElEtyYQ",
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

  function getData(data) {
    coordinates(data);

    const hasData = Array.isArray(data) && data.length > 0;
    if (!hasData) return;
    const geoJson = {
      type: "FeatureCollection",
      features: data.map((country = {}) => {
        // const countryFlag = country.countryInfo.flag;
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;

        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      }),
    };

    const geoJsonSecondLayer = {
      type: "FeatureCollection",
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;

        var km = Math.log2(country.cases) * 2 + country.cases / 20000;
        var points = 64;
        var coords = {
          latitude: lat,
          longitude: lng,
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
  getData(data);
  mymap.setView([50, 10], 5);
}
