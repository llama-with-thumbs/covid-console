export default class Covid {

  constructor(data) {
    this._data = data;
  }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = Object.assign({}, data);
  }

  parseData(json) {
    return JSON.parse(json);
  }

}

