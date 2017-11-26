/* eslint-disable */

export function updateColors(districtCircle, district, color) {
  districtCircle.style('fill', color);
  district.style('fill', '#212121');
}

export function updateSize(districtCircle, radius, time) {
  districtCircle.transition().attr('r', radius).duration(time);
}
