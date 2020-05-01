import { coronaData } from './coronaData.js';

const renderGraphBars = (data, key) => {
  // Clear out graph info
  d3.selectAll('svg > *').remove();

  // Variables for graph
  const svg = d3.select('svg').attr('class', `graph-${key}`);
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const xValue = (d) => d.date;
  const xLabel = 'date';
  const yValue = (d) => d[key];
  const yLabel = key;

  const margin = { top: 20, right: 0, bottom: 30, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const formatDate = (date) => {
    date = new Date(date);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  };

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => formatDate(xValue(d))))
    .range([0, innerWidth])
    .padding(0.25);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => yValue(d)) + 10])
    .range([innerHeight, 0]);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`);

  // Add left axis info and add title
  g.append('g').call(d3.axisLeft(yScale));
  // Title x and y position inverted due to rotation in css
  g.append('text')
    .attr('class', 'left-axis-label')
    .attr('x', -height / 2)
    .attr('y', '-30px')
    .text(yLabel);

  // Add bottom axis info and add title
  g.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);
  g.append('text')
    .attr('class', 'bottom-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', height)
    .text(xLabel);

  // Populate graph with bars of rectangles
  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(formatDate(xValue(d))))
    .attr('y', (d) => yScale(yValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => innerHeight - yScale(yValue(d)))
    .attr('class', `bar-${key}`);

  console.log('shit');
};

const renderTable = (data) => {
  const tableBody = document.getElementById('tableData');
  let dataHtml = '';

  for (let d of data) {
    dataHtml += `<tr><td>${d.date}</td><td>${d.cases}</td><td>${d.deaths}</td></tr>`;
  }

  tableBody.innerHTML = dataHtml;
};

// renderGraphBars(coronaData, 'cases');
document
  .getElementById('deaths-button')
  .addEventListener('click', () => renderGraphBars(coronaData, 'deaths'));

document
  .getElementById('cases-button')
  .addEventListener('click', () => renderGraphBars(coronaData, 'cases'));

// document.getElementById('deaths-button').addEventListener('click', function () {
//   console.log('what the fuck');
// });

window.onload = () => {
  renderTable(coronaData);
  renderGraphBars(coronaData, 'cases');
};

// const nd = new Date(coronaData[0].date);

// console.log(nd);

// console.log(d3);
