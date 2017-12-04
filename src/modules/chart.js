/* eslint-disable */
import $ from "jquery";

export function drawChart(year_dataset, index, factor) {
    let a = year_dataset.population * factor;
    $('#chart').children().each(function(idx, item) {
      if(idx === index) {
        $(item).css("width", a).html(year_dataset.population);
      }
    });
}

export function highlightChart(index) {
  console.log('hi', index);
    $('#chart').children().each(function(idx, item) {
      if(idx == index) {
        $(item).addClass('chart__bar--active');
      } else {
        $(item).removeClass('chart__bar--active');
      }
    });
}
