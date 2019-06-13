// Starship Names
var starships = {
  names: [
    'Enterprise',
    'Voyager',
    'Discovery',
    'Reliant',
    'Vengeance',
    'Defiant',
    'Summit',
    'Horatio',
    'Hermes',
    'Bradbury',
    'Endeavour',
  ],

  fly: function () {
    return this.names[Math.floor(Math.random() * Math.floor(this.names.length))]
  }
};

module.exports = starships;
