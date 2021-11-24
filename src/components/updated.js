import AbstractComponent from "./abstract-component.js";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const makeUpdatedMarkup = (date) => {
  const month = monthNames[+date.getMonth()];

  let h = date.getHours();
  h = h < 10 ? "0" + h : h;

  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;

  const day = date.getDate();

  return `<div class="updated">
      <p>Data as of <span>${month} ${day} at ${h}:${m}</span></p>

      <div class="box">
        <a class="button" href="#popup1">Data source and tips</a>
      </div>
      
      <div id="popup1" class="overlay">
        <div class="popup">
          <a class="close" href="#">&times;</a>
          <div class="content">
            <h3>Aggregated data sources:</h3>
            <ul>
              <li><a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a></li>
              <li><a href="https://covid19api.com/">https://covid19api.com/</a></li>
              <li><a href="https://corona.lmao.ninja/v2/countries">https://corona.lmao.ninja/v2/countries</a></li>
            </ul>
            <h3>* There could be several reasons for a zero data number:</h3>
            <ul>
              <li>the data is accurate</li>
              <li>the data delayed and will be added later</li>
              <li>the data is unfaithful. See CPIA transparency, accountability, 
              and corruption in the public sector rating. World Bank Group, CPIA database (<a href="http://www.worldbank.org/ida">http://www.worldbank.org/ida</a>).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
};

export default class Updated extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return makeUpdatedMarkup(this._data);
  }
}
