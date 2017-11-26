/* eslint-disable */
import pickGradientColor from './pickGradientColor';

export function calculateMapData(students, factor, p, maxPercentage, color1, color2, pi) {

  let percentageStudents = students * factor;

  let pStudents = (p / maxPercentage) * percentageStudents; //for size students

  let gradientPosition = parseFloat((students * factor)) / maxPercentage;
  let gradientColor = pickGradientColor(color1, color2, gradientPosition);

  let radiusStudents = Math.sqrt((pStudents / pi)); //for size students


  let obj = {
    color: gradientColor,
    radius: radiusStudents
  }
  return obj
}
