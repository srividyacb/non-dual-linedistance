'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');

var args = process.argv.slice(2);

var singleCount = 0;
var doubleCount = 0;

tileReduce({
    bbox: [-101.558, 29.114, -89.561, 42.033],
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [
        {
            name: 'osm',
            mbtiles: path.join(__dirname, args[0]),
            raw: false
        }
    ]
})
.on('reduce', function (num) {
    singleCount = singleCount + num[0];
    doubleCount = doubleCount + num[1];
})
.on('end', function () {
    console.log('This is single tolled roads:', singleCount);
    console.log('This is double tolled roads:', doubleCount);
});
