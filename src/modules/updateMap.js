/* eslint-disable */
import config from '../config/config.json';
import * as d3 from "d3";

export function updateColors(districtCircle, district, color) {
  districtCircle.style('fill', color);
  district.style('fill', '#212121');
}

export function updateSize(districtCircle, radius, time) {
  districtCircle.transition().attr('r', radius).duration(time);
}

export function updateText(districtText, value, time) {
  console.log('hi', districtText.text());
  districtText.transition().delay(time).tween('text', tweenText(districtText, value, districtText.text()));
}

function tweenText( item, newValue, currentValue ) {
  return function() {
    var i = d3.interpolateRound( currentValue, newValue );
    if(currentValue > newValue) {
      item.attr('fill', config.colors.down);
    } else {
      item.attr('fill', config.colors.up);
    }
    console.log(item.text());
    return function(t) {
      item.text(i(t));
    };
  }
}
