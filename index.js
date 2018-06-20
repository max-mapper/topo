/* **** Leaflet **** */

var loadOfflineControl = require('./leaflet-offline')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded.');
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (!granted) console.log("Storage persist not granted")
  })
}

// Base layers
//  .. OpenStreetMap
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

//  .. CartoDB Positron
var cartodb = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'});

//  .. OSM Toner
var toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'});

//  .. White background
var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==");

// Overlay layers (TMS)
var lyr = L.tileLayer('http://google2.publicbits.org:8081/tiles/gt2tiles/usfs/{z}/{x}/{y}.png', {tms: true, opacity: 1, attribution: ""});

loadOfflineControl(L)

// Map
var map = window.map = L.map('map', {
  center: [36.932330061503144, -97.294921875],
  zoom: 5,
  minZoom: 1,
  maxZoom: 15,
  fullscreenControl: true,
  offlineControl: true,
  layers: [white, lyr]
});

L.control.locate().addTo(map)

window.getTiles = function () {
  var xyz = require("xyz-affair")
  var bnd = map.getBounds()
  
  var bounds = [
    [
      bnd.getSouthWest().lng,
      bnd.getSouthWest().lat
    ],
    [
      bnd.getNorthEast().lng,
      bnd.getNorthEast().lat
    ]
  ]

  var tiles = xyz(bounds, 0, 15)
  tiles = tiles.map(function (t) {
    t.y = Math.pow(2, t.z) - t.y - 1
    return t
  })
  
  return tiles
}

window.saveTiles = function (tiles, onprogress) {
  var parallelLimit = require('run-parallel-limit')
  var reqs = tiles.map(function (t) {
    return function (callback) {
      var url = `http://google2.publicbits.org:8081/tiles/gt2tiles/usfs/${t.z}/${t.x}/${t.y}.png`
      fetch(url).then(function (response) {
        onprogress(null, url)
        callback(null)        
      }, function(error) {
        onprogress(error)
      })
    }
  })
  parallelLimit(reqs, 100, function (err, results) {
    onprogress()
  })
}

window.syncTiles = function () {
  var tiles = getTiles()
  var save = saveTiles(tiles, onprogress)
  var pending = tiles.length
  function onprogress (error, url) {
    pending--
    if (pending === 0) alert('done')
    if (error) return console.error(error)
    console.log('Downloaded', tiles.length - pending, '/', tiles.length)
      
  }
}

var basemaps = {"OpenStreetMap": osm, "CartoDB Positron": cartodb, "Stamen Toner": toner, "Without background": white}
var overlaymaps = {"Topo Layer": lyr}


// Add base layers
L.control.layers(basemaps, overlaymaps).addTo(map);
