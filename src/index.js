/* eslint-disable */
import config from './config/config.json';

// DEPENCENCY IMPORTS
import * as d3 from "d3";
import $ from "jquery";

//import scrolloverflow from './vendor/scrolloverflow.min.js';
import fullpage from './vendor/jquery.fullpage.min.js';


// MODUDLE IMPORTS
import createJson from './modules/createJson';
import { updateColors, updateSize, updateText, updatePositions, updateLabel, updateCounter } from './modules/updateMap';
import { calculateMapData } from './modules/calculator';
import { hoverLabel, hoverDistrict, onClick } from './modules/hover';
import pickGradientColor from './modules/pickGradientColor';
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
const GENDER = config.gender;

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
let isAbsolute = false;
let isExploded = false;
let navigationUpwards = false;
let datasetOutput = [];
let chartData = [];
let activeYear;
let lastYear = null;
let saveLegend = null;

let lastIndex = 0;
let lastStudentCount = 0;

// FUNCTIONS
function toggleAbsolute() {
  isAbsolute = !isAbsolute;
  if(!isAbsolute) {
    document.getElementById('toggle').innerHTML = 'RELATIV';
  } else {
    document.getElementById('toggle').innerHTML = 'ABSOLUT';
  }
  setupLegend(isAbsolute, isExploded);
  outputYear(activeYear);
}

function toggleExploded() {
  isExploded = !isExploded;
  $('.district-list').toggle( "slow", function() {
    // Animation complete.
  });
  setupLegend(isAbsolute, isExploded);
  outputYear(activeYear);
}

function toggleOverview() {
  var overlay = document.getElementById('overlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'block';
  }
}

function toggleImpressum() {
  var overlay = document.getElementById('impressum');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'block';
  }
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
      item.attr('display', 'none');
      item.attr('r', RADIUS);
      let itemText = d3.select('#' + data.districts[i].name.toLowerCase() + '_container');
      itemText.attr('opacity', 0);
      let itemFake = d3.select('#' + data.districts[i].name.toLowerCase() + '_fake');
      itemFake.attr('display', 'none');
  }
}

function outputYear(year_dataset) {
    activeYear = year_dataset;
    document.getElementById('year').innerHTML = year_dataset.year;
    document.getElementById('count').innerHTML = year_dataset.students + ' ' + GENDER;

    if(year_dataset.students > lastStudentCount) {
      document.getElementById('total').innerHTML = ' \u2191' + Math.abs((year_dataset.students - lastStudentCount)) + ' ' + GENDER;
      document.getElementById('total').style.color = 'green';
      if(lastYear !== null) {
        document.getElementById('total').innerHTML += ' mehr als ' + lastYear
      }
    } else {
      document.getElementById('total').innerHTML = ' \u2193' + Math.abs((year_dataset.students - lastStudentCount)) + ' ' + GENDER;
      document.getElementById('total').style.color = 'red';
      if(lastYear !== null) {
        document.getElementById('total').innerHTML += ' weniger als ' + lastYear
      }
    }
    if(lastStudentCount == 0) {
      //document.getElementById('total').innerHTML = (year_dataset.students - lastStudentCount) + ' ' + GENDER;
      document.getElementById('total').innerHTML = '';
      document.getElementById('total').style.color = '#4D4D4D';
    }

    lastStudentCount = year_dataset.students;
    lastYear = year_dataset.year;

    for (let i = 0; i < year_dataset.districts.length; i++) {
        let circle = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_circle');
        let container = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_container');
        let text = d3.select('#' + year_dataset.districts[i].name.toLowerCase() + '_text');
        let district = d3.select('#' + year_dataset.districts[i].name.toLowerCase());

        let mapData = calculateMapData(year_dataset.districts[i].data.students, year_dataset.districts[i].data.residents, STUDENTS_FACTOR, RELATIVE_STUDENTS_FACTOR, P, MAX_PERCENTAGE, GRADIENT, PI, isAbsolute);

        updateCounter(year_dataset.districts[i].name.toLowerCase(), year_dataset.districts[i].data.students, TRANSITION_TIME);
        updatePositions(year_dataset.districts[i].name.toLowerCase(), isExploded, container, TRANSITION_TIME);
        updateLabel(year_dataset.districts[i].name, year_dataset.districts[i].change, navigationUpwards, circle, container, text, mapData.radius, TRANSITION_TIME);
        updateColors(circle, district, mapData.color, year_dataset.districts[i].name.toLowerCase());
        updateSize(circle, mapData.radius, TRANSITION_TIME);
    }
}

function checkScrollDirection(actual, last) {
    if (actual > last) {
        navigationUpwards = true;
    } else {
        navigationUpwards = false;
    }
}

function setupLegend(isAbsolute, isExploded) {
  let dots = document.getElementById('colors');
  let headline = document.getElementById('legend__headline');
  let value = document.getElementById('legend__value');
  let explanation = document.getElementById('explanation');
  let explanation__headline = document.getElementById('explanation__headline');


  let colorStop = 0;
  let color;

  explanation__headline.innerHTML = ('Gesamtzahl an ' + GENDER + 'n');
  if(saveLegend === null) {
    saveLegend = explanation.innerHTML;
  }

  for (let i = 0; i < dots.children.length - 1; i++) {
    if(colorStop >= GRADIENT.colorstop) {
      color = pickGradientColor(GRADIENT.start, GRADIENT.mid, colorStop);
    } else {
      color = pickGradientColor(GRADIENT.mid, GRADIENT.end, colorStop);
    }
    dots.children[i].style.backgroundColor = '#' + color;
    colorStop += 0.05;
  }

  /*
  if(isExploded) {
    explanation.style.display = "none";
  } else {
    explanation.style.display = "inline-block";
  }
  */

  if(isAbsolute) {
    value.innerHTML = DATASET.maxVal.students;
    headline.innerHTML = GENDER;
  } else {
    value.innerHTML = DATASET.maxVal.relativeStudents.toFixed(2) * 100;
    headline.innerHTML = GENDER + ' pro 100 Einwohner';
  }

  if(isExploded) {
    explanation.innerHTML = ('je größer der Kreis desto mehr ' + GENDER);
  } else {
    explanation.innerHTML = saveLegend;
  }
}

// SCROLL INTERACTION
function buildFullPage() {
    $('#fullpage').fullpage({
        anchors:['2016', '2015', '2014', '2013', '2012'],
        css3: true,
        navigation: true,
        navigationPosition: 'left',
        keyboardScrolling: true,
        controlArrows: true,
        onLeave: function(index, nextIndex, direction) {
    		    yearData(nextIndex);
    	}
    });
}

// FILL IN CORRECT DATA
function yearData(nextIndex) {
  checkScrollDirection(nextIndex, lastIndex);
	switch(nextIndex) {
		//2016
		case 1:
      outputYear(datasetOutput[nextIndex-1]);
      highlightChart(nextIndex-1);
      break;

		//2015
		case 2:
      outputYear(datasetOutput[nextIndex-1]);
      highlightChart(nextIndex-1);
      break;

		//2014
		case 3:
      outputYear(datasetOutput[nextIndex-1]);
      highlightChart(nextIndex-1);
      break;

    //2013
    case 4:
      outputYear(datasetOutput[nextIndex-1]);
      highlightChart(nextIndex-1);
      break;

    //2012
    case 5:
      outputYear(datasetOutput[nextIndex-1]);
      highlightChart(nextIndex-1);
		  break;

		default:
			console.log("default");
	}
  lastIndex = nextIndex;
};

// RUNNING CODE
$(document).ready(function() {
    document.getElementById("toggle").addEventListener("click", toggleAbsolute);
    document.getElementById("explode").addEventListener("click", toggleExploded);
    document.getElementById("help").addEventListener("click", toggleOverview);
    document.getElementById("overlay").addEventListener("click", toggleOverview);
    document.getElementById("impressum").addEventListener("click", toggleImpressum);
    document.getElementById("impressum__button").addEventListener("click", toggleImpressum);


    setupLegend(isAbsolute, isExploded);
    setupDataPackages();
    resetVisual(datasetOutput[0]);
    buildFullPage();
    yearData(1);
    hoverLabel();
    hoverDistrict();
    onClick();
});
