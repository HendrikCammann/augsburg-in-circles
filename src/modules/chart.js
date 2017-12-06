/* eslint-disable */
import $ from "jquery";
import * as d3 from "d3";

export function drawChart(year_dataset, index, factor) {
    let a = year_dataset.population * factor;
    $('#chart').children().each(function(idx, item) {
      if(idx === index) {
        $(item).css("width", a).html(year_dataset.population);
      }
    });
}

export function highlightChart(index) {
    $('#chart').children().each(function(idx, item) {
      if(idx == index) {
        $(item).addClass('chart__bar--active');
      } else {
        $(item).removeClass('chart__bar--active');
      }
    });
}

export function drawGraph(data, maxVal) {
  let margin = {top: 20, right: 20, bottom: 70, left: 50},
      width = 1152 - margin.left - margin.right,
      height = 157 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleLinear().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  // define the line
  let area = d3.area()
    .x(function(d) { return x(d.year); })
    .y0(height)
    .y1(function(d) { return y(d.population); });

  let valueline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.population); });

  let svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("id", "chartline")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([data[0].year, data[data.length-1].year]);
  y.domain([250000, maxVal]);

  svg.append("path")
     .data([data])
     .attr("class", "area")
     .attr("d", area);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  svg.selectAll("dot")
    .data(data)
  .enter().append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.year); })
    .attr("cy", function(d) { return y(d.population); });


  /*svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(data.length))
      .selectAll("text")
        .style("text-anchor", "center")*/

}

export function highlightGraph(index) {
  $('#chartline').children('circle').each(function(idx, item) {
    if(idx === index) {
      $(item).addClass("active_year");
    } else {
      $(item).removeClass("active_year");
    }
  });
}
