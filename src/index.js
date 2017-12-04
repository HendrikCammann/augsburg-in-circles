/* eslint-disable */
import config from './config/config.json';

// DEPENCENCY IMPORTS
import * as d3 from "d3";
import $ from "jquery";

// MODUDLE IMPORTS
import createJson from './modules/createJson';
import { updateColors, updateSize, updateText, updatePositions } from './modules/updateMap';
import { calculateMapData } from './modules/calculator';
import { hoverCircle } from './modules/hover';

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
const GRADIENT = config.gradient;
const RADIUS = config.circles.radius;
const PI = config.circles.pi;
const P = PI * Math.pow(RADIUS, 2);


// MISC VARIABLES
const TRANSITION_TIME = config.transitions.time;
const MAP = d3.select('#map-complete');

// DYNAMIC VARIABLES
let isAbsolute = true;
let isExploded = true;
let datasetOutput = [];
let activeYear;


// FUNCTIONS
function toggleAbsolute() {
  isAbsolute = !isAbsolute;
  outputYear(activeYear);
}

function toggleExploded() {
  isExploded = !isExploded;
  outputYear(activeYear);
}

function outputYear(year_dataset) {
    document.getElementById('year').innerHTML = year_dataset.year;
    activeYear = year_dataset;

    for (let i = 0; i < year_dataset.districts.length; i++) {
        let circle = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_circle');
        //circle.attr('cx', config.views.normal.circles[i].cx).attr('cy', config.views.normal.circles[i].cy);
        //console.log(circle);
        let district = d3.select('#' + year_dataset.districts[i].name.toLowerCase());

        let mapData = calculateMapData(year_dataset.districts[i].data.students, year_dataset.districts[i].data.residents, STUDENTS_FACTOR, RELATIVE_STUDENTS_FACTOR, P, MAX_PERCENTAGE, GRADIENT, PI, isAbsolute);

        updatePositions(circle, district, i, isExploded, TRANSITION_TIME, MAP);
        updateColors(circle, district, mapData.color);
        updateSize(circle, mapData.radius, TRANSITION_TIME);
        //updateText(text, year_dataset.districts[i].data.students, TRANSITION_TIME);
    }
}

function setupMap() {
    for (let i = 0; i < DATASET.data.length; i++) {
        datasetOutput.push(DATASET.data[i]);
    }
    for (let i = 0; i < datasetOutput.length; i++) {
        setTimeout(function(){
            outputYear(datasetOutput[i]);
        }, 0 + (2000*i));
    }
}


// RUNNING CODE
$(document).ready(function(){
    document.getElementById("toggle").addEventListener("click", toggleAbsolute);
    document.getElementById("explode").addEventListener("click", toggleExploded);
    setupMap();
    // hoverCircle();
});
