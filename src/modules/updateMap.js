/* eslint-disable */
import config from '../config/config.json';
import * as d3 from "d3";
import $ from 'jquery';

import { TweenMax, TweenLite, Power2, TimelineLite } from "gsap";
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';

export function updateColors(districtCircle, district, color) {
    districtCircle.style('fill', color);
    district.style('fill', color);
}

export function updateSize(districtCircle, radius, time) {
    districtCircle.transition().attr('r', radius).duration(time);
}

export function updateText(districtText, value, time) {
    districtText.transition().duration(time).tween('text', tweenText(districtText, value, districtText.text()));
}

export function updatePositions(name, isExploded, text, time) {
    MorphSVGPlugin.convertToPath("rect, ellipse, line, polygon, polyline");

    let tl = new TimelineMax({
      repeat: 0,
      yoyo: false,
      repeatDelay: 0,
      delay: 0
    });

    if(!isExploded) {
        //$('#districts').addClass('mapScale');
        tl.to('#' + name, 1, {
          morphSVG: {
            shape: '#' + name + '_fake'
          },
          stroke: '#FFFFFF',
          //fill: '#4CAF50',
          ease: Back.easeInOut
        })
        text.transition().attr('opacity', 0).duration(time/10);
    } else {
        //$('#districts').removeClass('mapScale');
        tl.to('#' + name, 1, {
          morphSVG: {
            shape: '#' + name + '_circle'
          },
          stroke: '#FFFFFF',
          ease: Back.easeInOut
        })
        text.transition().delay(500).attr('opacity', 1).duration(time);
    }
}

export function updateLabel(name, district, districtText, radius, time) {
    let posX;

    if(parseFloat(district.attr('cx')) < 265) {
        posX = parseFloat(district.attr('cx')) - radius;
        districtText.attr('text-anchor', 'end');
        districtText.text(name + ' --');
    } else {
        posX = parseFloat(district.attr('cx')) + radius;
        districtText.attr('text-anchor', 'start');
        districtText.text('-- ' + name);
    }

    let posY = parseFloat(district.attr('cy')) + 3;

    districtText.attr('dx', posX).attr('dy', posY);
}

function tweenText(item, newValue, currentValue) {
    return function() {
        let i = d3.interpolateRound(currentValue, newValue);
        if(currentValue > newValue) {
            item.attr('fill', config.colors.down);
        } else {
            item.attr('fill', config.colors.up);
        }
        return function(t) {
            item.text(i(t));
        };
    }
}
