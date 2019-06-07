// Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
var getLuminance = function(rgba) {
  for (var i = 0; i < 3; i++) {
    var rgb = rgba[i];
    rgb /= 255;
    rgb = rgb < .03928 ? rgb / 12.92 : Math.pow((rgb + .055) / 1.055, 2.4);
    rgba[i] = rgb;
  }

  return .2126 * rgba[0] + .7152 * rgba[1] + 0.0722 * rgba[2];
};

module.exports = getLuminance;
