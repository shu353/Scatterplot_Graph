fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    const dataset = res;
    drawCanvas();
    generateScales(dataset);
    drawPoint(dataset);
    generateAxes();
  });

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");
let tooltip = d3.select("#tooltip");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = (dataset) => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d["Year"]) - 1,
      d3.max(dataset, (d) => d["Year"]) + 1,
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

const drawPoint = (dataset) => {
  const radiusValue = 6;
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", radiusValue)
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .attr("cx", (d) => xScale(d["Year"]))
    .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000)))
    .attr("fill", (d) => (d["Doping"] != "" ? "red" : "green"))
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      if (d["Doping"] != "") {
        tooltip.text(
          `${d["Year"]} - ${d["Name"]} - ${d["Time"]} - ${d["Doping"]}`
        );
      } else {
        tooltip.text(
          `${d["Year"]} - ${d["Name"]} - ${d["Time"]} - No doping problems`
        );
      }
      tooltip.attr("data-year", d["Year"]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
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
