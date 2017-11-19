/* eslint-disable */
import config from './config/config.json';
import * as d3 from "d3";

import createJson from './modules/createJson';
import pickGradientColor from './modules/pickGradientColor';

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

const TRANSITION_TIME = config.transition.time;

for (let i = 0; i < DATASET.data.length; i++) {
  setTimeout(function(){
    //if(i == 0) {
      for (let j = 0; j < DATASET.data[i].districts.length; j++) {
        let percentage = DATASET.data[i].districts[j].data.residents * POPULATION_FACTOR;
        let percentageStudents = DATASET.data[i].districts[j].data.students * STUDENTS_FACTOR;

        let p = (P / MAX_PERCENTAGE) * percentage; //for size population
        let pStudents = (P / MAX_PERCENTAGE) * percentageStudents; //for size students

        let gradientPosition = parseFloat((DATASET.data[i].districts[j].data.students * STUDENTS_FACTOR)) / MAX_PERCENTAGE;
        let gradientColor = pickGradientColor(COLOR1, COLOR2, gradientPosition);

        let radius = Math.sqrt((p / PI)); //for size population
        let radiusStudents = Math.sqrt((pStudents / PI)); //for size students

        let item = d3.select('#' + DATASET.data[i].districts[j].name.toLowerCase());
        item.style('fill', gradientColor);
        item.transition().style('r', radiusStudents).duration(TRANSITION_TIME);
      }
    //}
  }, 0 + (3000*i));
}

/*
for (let i = 1; i <= 26; i++) {
  let gradient_color = pickHex(COLOR1, COLOR2, i/26);
  console.log(i + ': ' +  rgbHex(gradient_color[0], gradient_color[1], gradient_color[2]))
}
*/
