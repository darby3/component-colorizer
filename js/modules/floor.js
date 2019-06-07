var floor = function floor(number, decimals) {
  decimals = +decimals || 0;

  var multiplier = Math.pow(10, decimals);

  return Math.floor(number * multiplier) / multiplier;
}


module.exports = floor;
