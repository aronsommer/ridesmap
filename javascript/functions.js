// function

function splitCamelCase(string){
 return string.replace(/([a-z])([A-Z])/g, '$1 $2');
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Color definition
var color_per_type = {
  "Ride":'#e31a1c',
  "Hike":'#6a3d9a',
  "Run":'#fb9a99',
  "Walk":'#a6cee3',
  "Swim":'#D678C9',
  "AlpineSki":'#b2df8a',
  "BackcountrySki":'#0b498f',
  "NordicSki":'#fdbf6f',
  "Snowshoe":'#cab2d6',
  "Kayaking":'#89c49c',
  "Windsurf":'#ffff99',
  "RockClimbing":'#c4c489',
  "Workout":'#ffa500',
  "Canoe":'#daa520',
  "InlineSkate":'#075207',
  "Kitesurf":'#f3e165',
  "Snowboard":'#4dd0e1',
  "IceSkate":'#684dad',
  "StandUpPaddle":'#e67e22',
  "Crossfit":'#ffe4e1',
  "E-BikeRide":'#f27461',
  "RollerSki":'#48d1cc',
  "Row":'#75827d'
};
