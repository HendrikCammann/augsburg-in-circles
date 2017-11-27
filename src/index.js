/* eslint-disable */
import config from './config/config.json';

// DEPENCENCY IMPORTS
import * as d3 from "d3";
import $ from "jquery";

// MODUDLE IMPORTS
import createJson from './modules/createJson';
import pickGradientColor from './modules/pickGradientColor';
import { updateColors, updateSize, updateText } from './modules/updateMap';
import { calculateMapData } from './modules/calculator';

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


// DYNAMIC VARIABLES
let isAbsolute = true;
let dataset_output = [];
let active_year;

for (let i = 0; i < DATASET.data.length; i++) {
  dataset_output.push(DATASET.data[i]);
}

function toggleAbsolute() {
  isAbsolute = !isAbsolute;
  outputYear(active_year);
}

function outputYear(year_dataset) {
    document.getElementById('year').innerHTML = year_dataset.year;
    active_year = year_dataset;

    for (let i = 0; i < year_dataset.districts.length; i++) {

        let circle = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_circle');
        let text = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_text');
        let district = d3.select('#' + year_dataset.districts[i].name.toLowerCase());

        let mapData = calculateMapData(year_dataset.districts[i].data.students, year_dataset.districts[i].data.residents, STUDENTS_FACTOR, RELATIVE_STUDENTS_FACTOR, P, MAX_PERCENTAGE, COLOR1, COLOR2, COLOR3, COLORSTOP, PI, isAbsolute);

        updateColors(circle, district, mapData.color);
        updateSize(circle, mapData.radius, TRANSITION_TIME);
        updateText(text, year_dataset.districts[i].data.students, TRANSITION_TIME);
    }
}

function setupMap() {
    for (let i = 0; i < dataset_output.length; i++) {
        setTimeout(function(){
          outputYear(dataset_output[i]);
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
  document.getElementById("toggle").addEventListener("click", toggleAbsolute);
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
