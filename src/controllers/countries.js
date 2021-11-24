import { render, remove, RenderPosition } from "../utils.js";
import CountriesComponent from "../components/countries.js";
import DeathsComponent from "../components/deaths.js";
import CasesComponent from "../components/cases.js";
import GlobalComponent from "../components/global.js";
import ChartComponent from "../components/chart/chart-component.js";
import {changeCoordinates} from "./map.js";

export default class CountriesController {
  constructor(container, model, filter = "world") {
    this._container = container;
    this._model = model;
    this._filter = filter;
    this._countries = null;
    this._deaths = null;
    this._cases = null;
    this._global = null;
    this._highlighted = null;

    // console.log("constructor");

    this._chart = null;
  }
  render() {
    const data = this._model.getData();    

    this._global = new GlobalComponent(data, this._filter);
    this._countries = new CountriesComponent(data, this._filter);
    this._deaths = new DeathsComponent(data, this._filter);
    this._cases = new CasesComponent(data, this._filter);
    this._chart = new ChartComponent(data, this._filter);
    
    // console.log("render");

    this._countries.setClickHandler((evt) => {
      this.countriesClickHandler(evt, data);
    });

    this.renderLists();
  }
  highlight(element){
    if (this._highlighted) {
      this._highlighted.classList.toggle("active");
    } else {
      document.querySelector(".c-world").classList.toggle("active");
    }
    element.classList.toggle("active");
    this._highlighted = element;
  }
  reRender(){
    // console.log("reRender");
    this.reRenderLists();
  }

  countriesClickHandler(evt, data) {
    this.onFilterChange(evt, data);
  }

  countriesReRender(data) {
    this.removeLists();
    this.reCreateLists(data);
    this.reRender();
  }

  getParent(element) {
    return element.parentElement;
  }
  getCountryCode(element, getParent) {
    if (element.getAttribute("data-region-code")) {
      return element.getAttribute("data-region-code");
    } else {
      return this.getCountryCode(this.getParent(element));
    }
  }

  getTableRow(element, getParent) {
    if (element.getAttribute("data-region-code")) {
      return element;
    } else {
      return this.getTableRow(this.getParent(element));
    }
  }

  onFilterChange(evt, data) {
    evt.preventDefault();
    const countryCode = this.getCountryCode(evt.target);

    // const newFilter = countryCode === "world" ? null : countryCode;
    const newFilter = countryCode;
    
    // console.log("countries.controllers: ",this._filter, newFilter, this._filter === newFilter);
    if (this._filter !== newFilter) {
      this._filter = newFilter;
      this.highlight(this.getTableRow(evt.target));
      this.countriesReRender(data);
      changeCoordinates(this._filter);
    }
  }

  reCreateLists(data) {
    // const newCountries = new CountriesComponent(data, this._filter);
    const newDeaths = new DeathsComponent(data, this._filter);
    const newCases = new CasesComponent(data, this._filter);
    const newGlobal = new GlobalComponent(data, this._filter);
    const chart = new ChartComponent(data, this._filter);
    // this._countries = newCountries;
    this._deaths = newDeaths;
    this._cases = newCases;
    this._global = newGlobal;
    this._chart = chart;
  }

  removeLists() {
    // remove(this._countries);
    if (this._deaths) remove(this._deaths);
    if (this._cases) remove(this._cases);
    if (this._global) remove(this._global);
    if (this._chart) remove(this._chart);
  }

  renderLists() {
    render(this._container, this._countries, RenderPosition.BEFOREEND);
    render(this._container, this._deaths, RenderPosition.BEFOREEND);
    render(this._container, this._cases, RenderPosition.BEFOREEND);
    render(this._container, this._global, RenderPosition.BEFOREEND);
    render(this._container, this._chart, RenderPosition.BEFOREEND);
  }
  reRenderLists() {
    render(this._container, this._deaths, RenderPosition.BEFOREEND);
    render(this._container, this._cases, RenderPosition.BEFOREEND);
    render(this._container, this._global, RenderPosition.BEFOREEND);
    render(this._container, this._chart, RenderPosition.BEFOREEND);
  }
}
