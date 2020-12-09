const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const request = new XMLHttpRequest();

let dataset = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d["Year"]),
      d3.max(dataset, (d) => d["Year"]),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d["Seconds"] * 1000)),
      d3.max(dataset, (d) => new Date(d["Seconds"] * 1000)),
    ])
    .range([padding, height - padding]);
};

const drawPoint = () => {
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .attr("cx", (d) => xScale(d["Year"]));
};

const generateAxes = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxsis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxsis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

request.open("GET", url, true);
request.onload = () => {
  dataset = JSON.parse(request.responseText);
  console.log(dataset);
  drawCanvas();
  generateScales();
  drawPoint();
  generateAxes();
};
request.send();
