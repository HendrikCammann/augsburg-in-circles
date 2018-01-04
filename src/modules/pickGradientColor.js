/* eslint-disable */
const rgbHex = require('rgb-hex');
export default function pickGradientColor(color1, color2, weight) {
    let p = weight;
    let w = p * 2 - 1;
    let w1 = (w/1+1) / 2;
    let w2 = 1 - w1;
    let rgb = [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)];
    let hex = rgbHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}
