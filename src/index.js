/* eslint-disable */
import config from './config/config.json';

// DEPENCENCY IMPORTS
import * as d3 from "d3";
import $ from "jquery";

// MODUDLE IMPORTS
import createJson from './modules/createJson';
import pickGradientColor from './modules/pickGradientColor';
import { updateColors, updateSize, updateText } from './modules/updateMap';
import { calculateMapData} from './modules/calculator';

import './styles/index.scss';

// DATA VARIABLES
const DATASET = createJson();
const POPULATION = DATASET.maxVal.residents;
const STUDENTS = DATASET.maxVal.students;
const RELATIVE_STUDENTS = DATASET.maxVal.relativeStudents;
const MAX_PERCENTAGE = config.maxPercentage
const POPULATION_FACTOR = MAX_PERCENTAGE / POPULATION;
const STUDENTS_FACTOR = MAX_PERCENTAGE / STUDENTS;
const RELATIVE_STUDENTS_FACTOR = MAX_PERCENTAGE / RELATIVE_STUDENTS;

// CIRCLE VARIABLES
const COLOR1 = config.gradient.start;
const COLOR2 = config.gradient.mid;
const COLOR3 = config.gradient.end;
const COLORSTOP = config.gradient.colorstop;
const RADIUS = config.circles.radius;
const PI = config.circles.pi;
const P = PI * Math.pow(RADIUS, 2);


// MISC VARIABLES
const TRANSITION_TIME = config.transitions.time;
let isAbsolute = true;

function setupMap() {
  for (let i = 0; i < DATASET.data.length; i++) {
    setTimeout(function(){
      document.getElementById('year').innerHTML = DATASET.data[i].year;
      for (let j = 0; j < DATASET.data[i].districts.length; j++) {
          let graphData = calculateMapData(DATASET.data[i].districts[j].data.students, STUDENTS_FACTOR, P, MAX_PERCENTAGE, COLOR1, COLOR2, COLOR3, COLORSTOP, PI, isAbsolute);

          let circle = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase() + '_circle');
          let district = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase());
          let text = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase() + '_text');

          if(!isAbsolute) {
            let gradientPosition = ((DATASET.data[i].districts[j].data.students / DATASET.data[i].districts[j].data.residents) * RELATIVE_STUDENTS_FACTOR) / MAX_PERCENTAGE;
            console.log(gradientPosition);
            let gradientColor;
            if(gradientPosition >= COLORSTOP) {
              gradientColor = pickGradientColor(COLOR1, COLOR2, gradientPosition);
            } else {
              gradientColor = pickGradientColor(COLOR2, COLOR3, gradientPosition);
            }
            updateColors(circle, district, gradientColor);
          } else {
            updateColors(circle, district, graphData.color);
          }

          updateSize(circle, graphData.radius, TRANSITION_TIME);
          updateText(text, DATASET.data[i].districts[j].data.students, TRANSITION_TIME);
        }
    }, 0 + (3000*i));
  }
}

for (let i = 0; i < 25; i++) {
  let pos = i / 25
  let color = pickGradientColor(COLOR1, COLOR3, pos);

  //console.log(i + ': ' + color);
}

// running code
$(document).ready(function(){
  setupMap();
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
});
