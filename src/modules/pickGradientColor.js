/* eslint-disable */
export default function pickGradientColor(color1, color2, weight) {
    let p = weight;
    let w = p * 2 - 1;
    let w1 = (w/1+1) / 2;
    let w2 = 1 - w1;
    let rgb = [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)];
    let hex = rgb2hex(rgb[0], rgb[1], rgb[2]);
    //let hex = 'acacac';
    return hex;
}

function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return (0x1000000 + rgb).toString(16).slice(1)
}
