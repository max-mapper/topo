var xyz = require("xyz-affair");

var bounds = [
  [
    -117.75009155273438, //minimum longitude (west)
    33.75003511886674, //minimum latitude (south)
  ],
  [
    -117.6254653930664, //maximum longitude (east)
    33.87526144934054, //maximum latitude (north)
  ]
]

var tiles = xyz(bounds, 0, 15);
tiles = tiles.map(function (t) {
 t.y = Math.pow(2, t.z) - t.y - 1
 return t
})
console.log(tiles.length)
 /*
  Returns an array of x/y/z objects, like:
  [
    {
     "x": 2411,
     "y": 3077,
     "z": 13
    },
    {
     "x": 2411,
     "y": 3078,
     "z": 13
    },
    ...
  ]
 */