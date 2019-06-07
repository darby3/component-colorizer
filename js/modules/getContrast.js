var get_luminance = require('./getLuminance');
var floor = require('./floor');

var getContrast = function(colorA, colorB) {
  // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef

  let l1 = get_luminance(colorA) + 0.05;
  let l2 = get_luminance(colorB) + 0.05;

  let ratio = floor((l1 > l2) ? (l1 / l2) : (1 / (l1 / l2)), 2);

  return ratio;
}

module.exports = getContrast;
