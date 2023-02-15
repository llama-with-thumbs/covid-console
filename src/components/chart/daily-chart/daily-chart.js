import {
  select,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  timeFormat,
} from "d3";

export default function dailyChart(country, data) {
  //clean section charts
  const charts = document.querySelector(".daily-chart");
  charts.innerHTML = "";
  if (document.querySelectorAll("daily-chart-title").length === 0) {
    const dailyChartTitle = document.createElement("div");
    dailyChartTitle.classList.add("daily-chart-title");
    dailyChartTitle.innerHTML = "Daily count of cases";
    charts.appendChild(dailyChartTitle);
  }
  const chartWrapper = document.createElement("div");
  chartWrapper.classList.add("daily-chart-csv__wrapper");
  charts.appendChild(chartWrapper);

  //size of .charts

  const svg = select(".daily-chart-csv__wrapper")
    .append("svg")
    .attr("width", charts.offsetWidth)
    .attr("height", charts.offsetHeight - 50);

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    const xValue = (d) => d.date;
    const yValue = (d) => d.cases;
    const margin = { top: 20, right: 0, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yScale = scaleLinear()
      .domain([0, max(data, yValue)])
      .range([innerHeight, 0]);

    const yAxisTickFormat = (d) => format(".2s")(d);

    const xScale = scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.1);

    const xAxis = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(timeFormat("%b"))
      .tickValues(xScale.domain().filter((d, i) => !(i % 80)));

    const yAxis = axisLeft(yScale)
      .tickFormat(yAxisTickFormat)
      .tickSize(-innerWidth);

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("g")
      .attr("class", "x axis")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    const rect = g
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(xValue(d)))
      .attr("height", (d) => innerHeight - yScale(yValue(d)))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(yValue(d)))
      .append("svg:title")
      .text(
        (d) =>
          `${d.date.toLocaleDateString("en-US")} : ${format(".3s")(d.cases)}`
      );

    rect.on("click", function () {
      event.stopPropagation();
    });

    rect.on("mouseover", function () {
      const chartNote = document.createElement("div");
      chartNote.classList.add("chart__note");
      chartNote.innerHTML = this.firstChild.innerHTML;
      document.querySelector(".daily-chart").appendChild(chartNote);

      let horizontal =
        this.getBoundingClientRect().left -
        chartNote.getBoundingClientRect().left;
      let vertical = this.getBoundingClientRect().height;
      chartNote.style.bottom = `${vertical}px`;
      chartNote.style.left = `${horizontal}px`;

      select(this).style("fill", "red");
    });
    rect.on("mouseleave", function () {
      select(this).style("fill", "steelblue");
      document.querySelector(".chart__note").remove();
    });
  };

  if (country === "total") {
    render(data);
  } else {
    let previousDayNumber = 0;
    const newData = data.map((d) => {
      let numberInCurrentDay = +d.Cases - previousDayNumber;
      previousDayNumber = +d.Cases;
      return { cases: Math.abs(numberInCurrentDay), date: new Date(d.Date) };
    });
    render(newData);
  }

  return " ";
}
