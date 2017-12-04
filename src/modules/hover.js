/* eslint-disable */
import $ from "jquery";

export function hoverCircle () {
  $('.circle').mouseenter(function(event){
    console.log(event.target.style.fill);
    $('#' + event.target.id).css({
      "stroke": "#212121",
      "stroke-width": "1.5"
    });
    $('#' + event.target.id.replace('_circle', '')).css({
      "fill": event.target.style.fill
    });
  })
  $('.circle').mouseleave(function(event){
    $('#' + event.target.id).css({
      "stroke": "#FFFFFF",
      "stroke-width": "0"
    });
    $('#' + event.target.id.replace('_circle', '')).css({
      "fill": "#212121"
    });
  })
}
