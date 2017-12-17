/* eslint-disable */
import $ from "jquery";

export function hoverCircle () {
  $('.circle').mouseenter(function(event){
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

export function hoverLabel () {
  $('.label__js').mouseenter(function(event){
    console.log(event.target.id);
    let district = event.target.id.replace('__label', '')
    $('#' + district).css({
      "stroke": "#212121",
      "stroke-width": "2.5"
    });
  })
  $('.label__js').mouseleave(function(event){
    let district = event.target.id.replace('__label', '')

    $('#' + district).css({
      "stroke": "#FFFFFF",
      "stroke-width": "0"
    })
  })
}
