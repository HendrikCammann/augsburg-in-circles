/* eslint-disable */
import $ from "jquery";

export function hoverDistrict () {
  $('.scaleItem').mouseenter(function(event){
    $('#' + event.target.id + '__label').css({
      'border-color': '#404040',
    });
    $('#' + event.target.id).css({
      "stroke": "#212121",
      "stroke-width": "2.5"
    });
  })
  $('.scaleItem').mouseleave(function(event){
    $('#' + event.target.id + '__label').css({
      'border-color': '#F2F2F2',
    });
    $('#' + event.target.id).css({
      "stroke": "#212121",
      "stroke-width": "0"
    });
  })
}

export function hoverLabel () {
  $('.label__js').mouseenter(function(event){
    $('#' + event.target.id).css({
      'border-color': '#404040',
    });

    let district = event.target.id.replace('__label', '')
    $('#' + district).css({
      "stroke": "#212121",
      "stroke-width": "2.5"
    });
  })
  $('.label__js').mouseleave(function(event){
    $('#' + event.target.id).css({
      'border-color': '#F2F2F2',
    });

    let district = event.target.id.replace('__label', '')
    $('#' + district).css({
      "stroke": "#FFFFFF",
      "stroke-width": "0"
    })
  })
}
