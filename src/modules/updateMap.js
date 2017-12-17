/* eslint-disable */
import config from '../config/config.json';
import * as d3 from "d3";
import { TweenMax, TweenLite, Power2, TimelineLite } from "gsap";
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';

export function updateColors(districtCircle, district, color, name) {
    districtCircle.style('fill', color);
    district.style('fill', color);
    document.getElementById(name + '__label').style.color = "#" + color;
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
        d3.select('#counters').transition().delay(500).attr('opacity', '1').duration(time);
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
        tl.to('#' + name, 1, {
          morphSVG: {
            shape: '#' + name + '_circle'
          },
          stroke: '#FFFFFF',
          ease: Back.easeInOut
        })
        text.transition().delay(500).attr('opacity', 1).duration(time);
        d3.select('#counters').transition().attr('opacity', '0').duration(time/2);
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
    if(name.toLowerCase() === 'innenstadt') {
      console.log('hi');
      posY += 20;
      posY -= 5;
    }
    if(name.toLowerCase() === 'jakobervorstadt') {
      console.log('hi');
      posY -= 10;
      posY -= 5;
    }
    if(name.toLowerCase() === 'univiertel') {
      console.log('hi');
      posX += 10;
      posY += 20;
    }

    districtText.attr('dx', posX).attr('dy', posY);
}

export function updateCounter(name, students,time) {
  let largeCircle = d3.select('#' + name + '_center');
  let amount = 0;
  if (students >= 1000) {
    largeCircle.transition().attr('opacity', "1").duration(time);
    amount = students - 1000;
    amount = parseInt(amount / 100);
  } else {
    largeCircle.transition().attr('opacity', "0").duration(time);
    amount = parseInt(students / 100);
  }

  for (let j = 0; j < 9; j++) {
    let item = d3.select('#' + name + '_' + j);
    if(j < amount) {
      item.transition().attr('r', '10').attr('opacity', "1").attr('r', '4').duration(time);
    } else {
      item.transition().attr('opacity', "0").duration(time);
    }
  }
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
