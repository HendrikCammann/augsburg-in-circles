/* eslint-disable */
import config from './config/config.json';

// DEPENCENCY IMPORTS
import * as d3 from "d3";
import $ from "jquery";

//import scrolloverflow from './vendor/scrolloverflow.min.js';
import fullpage from './vendor/jquery.fullpage.min.js';


// MODUDLE IMPORTS
import createJson from './modules/createJson';
import { updateColors, updateSize, updateText, updatePositions, updateLabel } from './modules/updateMap';
import { calculateMapData } from './modules/calculator';
import { hoverCircle } from './modules/hover';
import { drawChart, highlightChart, drawGraph, highlightGraph } from './modules/chart';

import './styles/index.scss';

// DATA VARIABLES
const DATASET = createJson();
const AUGSBURG_RESIDENTS = DATASET.maxVal.population;
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

// CHART VARIABLES
const MAX_WIDTH = config.chart.width;
const CHART_FACTOR = MAX_WIDTH/AUGSBURG_RESIDENTS;

// MISC VARIABLES
const TRANSITION_TIME = config.transitions.time;
const MAP = d3.select('#map-complete');

// DYNAMIC VARIABLES
let isAbsolute = true;
let isExploded = false;
let datasetOutput = [];
let chartData = [];
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

function setupDataPackages() {
    for (let i = 0; i < DATASET.data.length; i++) {
        datasetOutput.push(DATASET.data[i]);
        let obj = {
          year: DATASET.data[i].year,
          population: DATASET.data[i].population
        };
        chartData.push(obj);
        drawChart(DATASET.data[i], i, CHART_FACTOR);
    }
}

function resetVisual(data) {
  for (let i = 0; i < data.districts.length; i++) {
      let item = d3.select('#' + data.districts[i].name.toLowerCase() + '_circle');
      item.attr('opacity', 0);
      item.attr('r', RADIUS);
      let itemText = d3.select('#' + data.districts[i].name.toLowerCase() + '_text');
      itemText.attr('opacity', 0);
  }
}

function outputYear(year_dataset) {
    //document.getElementById('year').innerHTML = year_dataset.year;
    activeYear = year_dataset;
    for (let i = 0; i < year_dataset.districts.length; i++) {
        let circle = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_circle');
        let text = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_text');
        let district = d3.select('#' + year_dataset.districts[i].name.toLowerCase());

        let mapData = calculateMapData(year_dataset.districts[i].data.students, year_dataset.districts[i].data.residents, STUDENTS_FACTOR, RELATIVE_STUDENTS_FACTOR, P, MAX_PERCENTAGE, GRADIENT, PI, isAbsolute);

        updatePositions(year_dataset.districts[i].name.toLowerCase(), isExploded, text, TRANSITION_TIME);
        updateLabel(year_dataset.districts[i].name, circle, text, mapData.radius, TRANSITION_TIME);
        updateColors(circle, district, mapData.color);
        updateSize(circle, mapData.radius, TRANSITION_TIME);

        //updateText(text, year_dataset.districts[i].data.students, TRANSITION_TIME);
    }
}

// SCROLL INTERACTION
function buildFullPage() {
    $('#fullpage').fullpage({
        anchors:['2016', '2015', '2014', '2013', '2012'],
        css3: false,
        onLeave: function(index, nextIndex, direction) {
    		yearData(nextIndex);
    	}
    });
}

// FILL IN CORRECT DATA
function yearData(nextIndex) {
	switch(nextIndex) {
		//2016
		case 1:
            console.log(2016);
            outputYear(datasetOutput[nextIndex-1]);
            highlightChart(nextIndex-1);
			break;

		//2015
		case 2:
            console.log(2015);
            outputYear(datasetOutput[nextIndex-1]);
            highlightChart(nextIndex-1);
			break;

		//2014
		case 3:
            console.log(2014);
            outputYear(datasetOutput[nextIndex-1]);
            highlightChart(nextIndex-1);
			break;

        //2013
        case 4:
            console.log(2013);
            outputYear(datasetOutput[nextIndex-1]);
            highlightChart(nextIndex-1);
			break;

        //2012
        case 5:
            console.log(2012);
            outputYear(datasetOutput[nextIndex-1]);
            highlightChart(nextIndex-1);
			break;

		default:
			console.log("default");
	}
};

// RUNNING CODE
$(document).ready(function(){
    document.getElementById("toggle").addEventListener("click", toggleAbsolute);
    document.getElementById("explode").addEventListener("click", toggleExploded);

    /*$('.chart__bar').click(function(event) {
      outputYear(datasetOutput[event.target.attributes.year.value], false);
      highlightChart(event.target.attributes.year.value);
    });*/
    setupDataPackages();
    resetVisual(datasetOutput[0]);
    //setupMap();
    buildFullPage();
    yearData(1);
    //drawGraph(chartData, AUGSBURG_RESIDENTS);
    // hoverCircle();
});
