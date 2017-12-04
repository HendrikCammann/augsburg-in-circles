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
    districtText.transition().duration(time).tween('text', tweenText(districtText, value, districtText.text()));
}

export function updatePositions(districtCircle, district, index, isExploded, time, map) {
    if(!isExploded) {
        map.transition(time).attr("transform", "translate(" + config.views.positions.x + "," + config.views.positions.y + ")");
        districtCircle.transition(time).attr('cx', config.views.normal.circles[index].cx).attr('cy', config.views.normal.circles[index].cy);
        district.transition(time).attr('points', config.views.normal.districts[index].d);
    } else {
        map.transition(time).attr("transform", "translate(" + config.views.positions.x/100 + "," + config.views.positions.y/10 + ")");
        districtCircle.transition(time).attr('cx', config.views.exploded.circles[index].cx).attr('cy', config.views.exploded.circles[index].cy);
        district.transition(time).attr('points', config.views.exploded.districts[index].d);
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
