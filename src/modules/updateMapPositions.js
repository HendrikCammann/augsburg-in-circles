/* eslint-disable */
import * as d3 from "d3";
export default function updateMapPositions(data, transitonTime) {
  for(let j = 0; j < data.districts.length; j++) {
    let districtCircle = d3.select('#' + data.districts[j].name.toLowerCase());
    let districtOutline = d3.select('#' + data.districts[j].name.toLowerCase() + '_out');
    districtCircle.transition().attr('cx', data.circles[j].cx).attr('cy', data.circles[j].cy).duration(transitonTime);
    districtOutline.transition().attr("d", data.districts[j].d).duration(transitonTime);
    //districtCircle.transition().style('cy', data.circles[j].cy);
  }
}
