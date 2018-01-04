/* eslint-disable */
import pickGradientColor from './pickGradientColor';

export function calculateMapData(students, residents, factor, relativeFactor, p, maxPercentage, gradient, pi, isAbsolute) {

  let percentageStudents = students * factor;

  let pStudents = (p / maxPercentage) * percentageStudents;

  let gradientPosition;
  if(isAbsolute) {
    gradientPosition = parseFloat((students * factor)) / maxPercentage;
  } else {
    gradientPosition = parseFloat(((students / residents) * relativeFactor)) / maxPercentage;
  }

  let gradientColor;
  if(gradientPosition >= gradient.colorstop) {
    gradientColor = pickGradientColor(gradient.start, gradient.mid, gradientPosition);
  } else {
    gradientColor = pickGradientColor(gradient.mid, gradient.end, gradientPosition);
  }

  let radiusStudents = Math.sqrt((pStudents / pi));

  let obj = {
    color: gradientColor,
    radius: radiusStudents
  }
  return obj
}
