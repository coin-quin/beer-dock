/*
 * beer_database
 * https://github.com/coin-quin/databeer
 *
 * Copyright (c) 2019 HugoFooy
 * Licensed under the HF license.
 */
/*jslint node:true */

'use strict';

var howmuch = function(n) {
  var text = "Beer is ";
  for (var i = 0; i < n; i++){
    text += "really ";
  }
  text += "AWESOME!";
  
  return text;
};
 
module.exports.awesome = howmuch;

var beerparser = function(data){
  var parsed_data = [];
  
  data.beers.forEach( function(beer){
    var b = {
      name: beer.name,
      score: beer.score,
      date: data.date,
      session: data.id
    };
    
    parsed_data.push(b);
  });
  
  return parsed_data;
};

module.exports.beerparser = beerparser;

var dbtohtml = function(data){
  
  var html = "<table style='width:50%>' class='dbtable'>";
  data.forEach(function (beer){
    html += "<tr><th>" + beer.name + "</th><th>" + beer.score + "</th></tr>";
  });
  html += "</table";
  
  return html;
};

module.exports.dbtohtml = dbtohtml;

