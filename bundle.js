(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* **** Leaflet **** */

var loadOfflineControl = require('./leaflet-offline')
var TILES='https://tiles.maxogden.com/gt2tiles/usfs'

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
var lyr = L.tileLayer(TILES + '/{z}/{x}/{y}.png', {tms: true, opacity: 1, attribution: ""});

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
      var url = `${TILES}/${t.z}/${t.x}/${t.y}.png`
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

},{"./leaflet-offline":2,"run-parallel-limit":3,"xyz-affair":4}],2:[function(require,module,exports){
module.exports = function (L) {
  L.Control.Offline = L.Control.extend({
    options: {
      position: 'topleft'
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-offline leaflet-bar leaflet-control');

      this.link = L.DomUtil.create('a', 'leaflet-control-offline-button leaflet-bar-part', container);
      this.link.href = '#';

      this._map = map;
      // this._map.on('fullscreenchange', this._toggleTitle, this);
      // this._toggleTitle();

      L.DomEvent.on(this.link, 'click', this._click, this);

      return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      syncTiles()
    }// ,
//
//     _toggleTitle: function() {
//       this.link.title = this.options.title[this._map.isFullscreen()];
//     }
  });

  L.Map.mergeOptions({
    offlineControl: false
  });

  L.Map.addInitHook(function () {
    if (this.options.offlineControl) {
      this.offlineControl = new L.Control.Offline(this.options.offlineControl);
      this.addControl(this.offlineControl);
    }
  });

  L.control.offline = function (options) {
    return new L.Control.Offline(options);
  };
}
},{}],3:[function(require,module,exports){
(function (process){
module.exports = runParallelLimit

function runParallelLimit (tasks, limit, cb) {
  if (typeof limit !== 'number') throw new Error('second argument must be a Number')
  var results, len, pending, keys, isErrored
  var isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = len = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = len = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (err) isErrored = true
    if (--pending === 0 || err) {
      done(err)
    } else if (!isErrored && next < len) {
      var key
      if (keys) {
        key = keys[next]
        next += 1
        tasks[key](function (err, result) { each(key, err, result) })
      } else {
        key = next
        next += 1
        tasks[key](function (err, result) { each(key, err, result) })
      }
    }
  }

  var next = limit
  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.some(function (key, i) {
      tasks[key](function (err, result) { each(key, err, result) })
      if (i === limit - 1) return true // early return
    })
  } else {
    // array
    tasks.some(function (task, i) {
      task(function (err, result) { each(i, err, result) })
      if (i === limit - 1) return true // early return
    })
  }

  isSync = false
}

}).call(this,require('_process'))
},{"_process":5}],4:[function(require,module,exports){

    var R = 6378137,
        sphericalScale = 0.5 / (Math.PI * R);

    module.exports = function(bounds, minZoom, maxZoom) {

      var min,
          max,
          tiles = [];

      if (!maxZoom) {
        max = min = minZoom;
      } else if (maxZoom < minZoom) {
        min = maxZoom;
        max = minZoom;
      } else {
        min = minZoom;
        max = maxZoom;
      }

      for (var z = min; z <= max; z++) {
        tiles = tiles.concat(xyz(bounds,z));
      }

      return tiles;

    };

    /* Adapted from: https://gist.github.com/mourner/8825883 */
    function xyz(bounds, zoom) {


          //north,west
      var min = project(bounds[1][1],bounds[0][0], zoom),
          //south,east
          max = project(bounds[0][1],bounds[1][0], zoom),
          tiles = [];

      for (var x = min.x; x <= max.x; x++) {
        for (var y = min.y; y <= max.y; y++) {
            tiles.push({
              x: x,
              y: y,
              z: zoom
            });
        }
      }

      return tiles;

    }

    /* 
       Adapts a group of functions from Leaflet.js to work headlessly
       https://github.com/Leaflet/Leaflet
       
       Combines/modifies the following methods:
       L.Transformation._transform (src/geometry/Transformation.js)
       L.CRS.scale (src/geo/crs/CRS.js)
       L.CRS.latLngToPoint (src/geo/crs/CRS.js)
       L.Projection.SphericalMercator.project (src/geo/projection/Projection.SphericalMercator.js)
    */
    function project(lat,lng,zoom) {
      var d = Math.PI / 180,
          max = 1 - 1E-15,
          sin = Math.max(Math.min(Math.sin(lat * d), max), -max),
          scale = 256 * Math.pow(2, zoom);

      var point = {
        x: R * lng * d,
        y: R * Math.log((1 + sin) / (1 - sin)) / 2
      };

      point.x = tiled(scale * (sphericalScale * point.x + 0.5));
      point.y = tiled(scale * (-sphericalScale * point.y + 0.5));

      return point;
    }

    function tiled(num) {
      return Math.floor(num/256);
    }
},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
