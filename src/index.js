/* eslint-disable */
import config from './config/config.json';
import * as d3 from "d3";

import createJson from './modules/createJson';
import pickGradientColor from './modules/pickGradientColor';
import updateMapPositions from './modules/updateMapPositions';


const DATASET = createJson();
const POPULATION = DATASET.maxVal.residents;
const STUDENTS = DATASET.maxVal.students;
const MAX_PERCENTAGE = config.maxPercentage
const POPULATION_FACTOR = MAX_PERCENTAGE / POPULATION;
const STUDENTS_FACTOR = MAX_PERCENTAGE / STUDENTS;

const COLOR1 = config.gradient.start;
const COLOR2 = config.gradient.end;
const RADIUS = config.circles.radius;
const PI = config.circles.pi;
const P = PI * Math.pow(RADIUS, 2);

const POSITIONS = config.views;
const MAP_POSITIONS = config.views.positions;
const MAP = d3.select('#map-complete');

const TRANSITION_TIME = config.transition.time;

let isExploded = false;

document.getElementById("toggle").addEventListener("click", toggleExploded);
setupMap();

function toggleExploded() {
  isExploded = !isExploded;
  if(!isExploded) {
    MAP.transition().attr("transform", "translate(" + MAP_POSITIONS.x + "," + MAP_POSITIONS.y + ")").duration(TRANSITION_TIME);
    updateMapPositions(POSITIONS.normal, TRANSITION_TIME);
  } else {
    MAP.transition().attr("transform", "translate(" + MAP_POSITIONS.x/2 + "," + MAP_POSITIONS.y/2 + ")").duration(TRANSITION_TIME);
    updateMapPositions(POSITIONS.exploded, TRANSITION_TIME);
  }
}

function setupMap() {
  for (let i = 0; i < DATASET.data.length; i++) {
    setTimeout(function(){
      document.getElementById('year').innerHTML = DATASET.data[i].year;
      for (let j = 0; j < DATASET.data[i].districts.length; j++) {
          //let percentage = DATASET.data[i].districts[j].data.residents * POPULATION_FACTOR;
          let percentageStudents = DATASET.data[i].districts[j].data.students * STUDENTS_FACTOR;

          //let p = (P / MAX_PERCENTAGE) * percentage; //for size population
          let pStudents = (P / MAX_PERCENTAGE) * percentageStudents; //for size students

          let gradientPosition = parseFloat((DATASET.data[i].districts[j].data.students * STUDENTS_FACTOR)) / MAX_PERCENTAGE;
          let gradientColor = pickGradientColor(COLOR1, COLOR2, gradientPosition);

          //let radius = Math.sqrt((p / PI)); //for size population
          let radiusStudents = Math.sqrt((pStudents / PI)); //for size students

          let districtCircle = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase());
          let districtOutline = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase() + '_out');

          if(!isExploded) {
            MAP.transition().attr("transform", "translate(" + MAP_POSITIONS.x + "," + MAP_POSITIONS.y + ")").duration(TRANSITION_TIME);
            districtCircle.transition().attr('cx', POSITIONS.normal.circles[j].cx).attr('cy', POSITIONS.normal.circles[j].cy).duration(TRANSITION_TIME);
            districtOutline.transition().attr("d", POSITIONS.normal.districts[j].d).duration(TRANSITION_TIME);

          } else {
            MAP.transition().attr("transform", "translate(" + MAP_POSITIONS.x/2 + "," + MAP_POSITIONS.y/2 + ")").duration(TRANSITION_TIME);
            districtCircle.transition().attr('cx', POSITIONS.exploded.circles[j].cx).attr('cy', POSITIONS.exploded.circles[j].cy).duration(TRANSITION_TIME);
            districtOutline.transition().attr("d", POSITIONS.exploded.districts[j].d).duration(TRANSITION_TIME);
          }
          districtCircle.style('fill', gradientColor);
          districtCircle.transition().attr('r', radiusStudents).duration(TRANSITION_TIME);
        }
    }, 0 + (3000*i));
  }
}
