/* eslint-disable */
import pickGradientColor from './pickGradientColor';

export function calculateMapData(students, residents, factor, relativeFactor, p, maxPercentage, color1, color2, color3, colorstop, pi, isAbsolute) {

  let percentageStudents = students * factor;

  let pStudents = (p / maxPercentage) * percentageStudents; //for size students

  let gradientPosition;
  if (isAbsolute) {
    gradientPosition = parseFloat((students * factor)) / maxPercentage;
  } else {
    gradientPosition = parseFloat(((students / residents) * relativeFactor)) / maxPercentage;
  }

  let gradientColor;
  if(gradientPosition >= colorstop) {
    gradientColor = pickGradientColor(color1, color2, gradientPosition);
  } else {
    gradientColor = pickGradientColor(color2, color3, gradientPosition);
  }

  let radiusStudents = Math.sqrt((pStudents / pi)); //for size students

  let obj = {
    color: gradientColor,
    radius: radiusStudents
  }
  return obj
}
