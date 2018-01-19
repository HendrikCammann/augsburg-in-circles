/* eslint-disable */
import config from '../config/config.json';
import * as d3 from "d3";
import { TweenMax, TweenLite, Power2, TimelineLite } from "gsap";
import MorphSVGPlugin from '../vendor/MorphSVGPlugin';

export function updateColors(districtCircle, district, color, name) {
    document.getElementById(name).setAttribute("fill", '#' + color);
    //districtCircle.style('fill', color);
    district.style('fill', color);
}

export function updateSize(districtCircle, radius, time) {
    districtCircle.transition().attr('r', radius).duration(time);
}

export function updateText(districtText, value, time) {
    districtText.transition().duration(time).tween('text', tweenText(districtText, value, districtText.text()));
}

export function updatePositions(name, isExploded, container, time) {
    MorphSVGPlugin.convertToPath("ellipse, line, polygon, polyline");

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
          ease: Back.easeInOut
        })
        container.transition().attr('opacity', 0).duration(time/10);
    } else {
        tl.to('#' + name, 1, {
          morphSVG: {
            shape: '#' + name + '_circle'
          },
          ease: Back.easeInOut
        })
        container.transition().delay(500).attr('opacity', 1).duration(time);
        d3.select('#counters').transition().attr('opacity', '0').duration(time/2);
    }
}

export function updateLabel(name, change, scrollDirection, district, container, districtText, radius, time) {
    let posX;
    let changeVal;
    let id = name.toLowerCase() + '__text-anim';
    let oldVal = 0;
    let item;

    try {
      item = d3.select('#' + id);
      oldVal = item.text();
    } catch(err) {

    }
    if(scrollDirection) {
        changeVal = change.next;
    } else {
        changeVal = change.last;
    }

    if(parseFloat(district.attr('cx')) < 265) {
        posX = parseFloat(district.attr('cx')) - radius;
        container.attr('text-anchor', 'end');
        if(changeVal > 0) {
          districtText.html(name + '<tspan dy="1" class="change--pos">' + ' \u2191' + '<tspan id=' + id + '></tspan></tspan>' + ' \u2014');
        } else if (changeVal < 0){
          districtText.html(name + '<tspan dy="1" class="change--neg">' + ' \u2193' + '<tspan id=' + id + '></tspan></tspan>' + ' \u2014');
        } else {
          districtText.html(name + '<tspan dy="1" class="change">' + ' \u2192' + '<tspan id=' + id + '></tspan></tspan>' + ' \u2014');
        }
    } else {
        posX = parseFloat(district.attr('cx')) + radius;
        container.attr('text-anchor', 'start');
        if(changeVal > 0) {
          districtText.html('\u2014 ' + name + '<tspan dy="1" class="change--pos">' + ' \u2191' + '<tspan id=' + id + '></tspan></tspan>');
        } else if (changeVal < 0) {
          districtText.html('\u2014 ' + name + '<tspan dy="1" class="change--neg">' + ' \u2193' + '<tspan id=' + id + '></tspan></tspan>');
        } else {
          districtText.html('\u2014 ' + name + '<tspan dy="1" class="change">' + ' \u2192' + '<tspan id=' + id + '></tspan></tspan>');
        }
    }

    item = d3.select('#' + id);
    item.transition().duration(time).tween('text', tweenText(item, changeVal, oldVal));

    let posY = parseFloat(district.attr('cy')) - 10;

    if(name.toLowerCase() === 'innenstadt') {
      posY += 20;
      posX -= 6;
    }
    if(name.toLowerCase() === 'jakobervorstadt') {
      posY -= 10;
      posX -= 3;
    }
    if(name.toLowerCase() === 'hochfeld') {
      posY += 7;
      posX -= 2;
    }

    container.attr('x', posX).attr('y', posY);
}

export function updateCounter(name, students,time) {
  let largeCircle = d3.select('#' + name + '_center');
  let amount = 0;
  if (students >= 1000) {
    largeCircle.transition().attr('opacity', "1").duration(time);
    amount = students - 1000;
    amount = parseInt(amount / 100);
  } else {
    largeCircle.transition().attr('opacity', "0.1").duration(time);
    amount = parseInt(students / 100);
  }

  for (let j = 0; j < 9; j++) {
    let item = d3.select('#' + name + '_' + j);
    if(j < amount) {
      item.transition().attr('r', '10').attr('opacity', "1").attr('r', '4').duration(time);
    } else {
      item.transition().attr('opacity', "0.05").duration(time);
    }
  }
}

function tweenText(item, newValue, currentValue) {
    return function() {
        let i = d3.interpolateRound(currentValue, newValue);
        return function(t) {
            item.text(i(t));
            /*if(item.text() < 0) {
              item.text(Math.abs(item.text()));
            }*/
        };
    }
}
