/* eslint-disable */
import * as d3 from "d3";
export default function updateMapPositions(data, transitonTime) {
  for(let j = 0; j < data.districts.length; j++) {
    let districtCircle = d3.select('#' + data.districts[j].name.toLowerCase());
    let districtOutline = d3.select('#' + data.districts[j].name.toLowerCase() + '_out');
    districtOutline.transition().attr("d", data.districts[j].d).duration(transitonTime);
    districtCircle.style('cx', data.circles[j].cx);
    districtCircle.style('cy', data.circles[j].cy);
  }
}
