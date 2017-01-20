'use strict';
var turf = require('turf');
var _ = require('underscore');

module.exports = function (data, tile, writeData, done) {
    var result = [];
    var singleDistance = 0;
    var doubledistance = 0;
    var osmLayer = data.osm.osm;
    osmLayer.features = _.filter(osmLayer.features, function (fe) {
        return fe.geometry.type === 'LineString';
    }
);
    for (var i = 0; i < osmLayer.features.length; i++) {
        if (osmLayer.features[i].properties.hasOwnProperty('toll') && osmLayer.features[i].properties['toll'] === 'yes' && osmLayer.features[i].geometry.type === 'LineString') {
            if (i === osmLayer.features.length) {
                singleDistance += turf.lineDistance(osmLayer.features[i], 'kilometers');
                break;
            }
            var bufferedHighway = turf.buffer(osmLayer.features[i], 50, 'meters');
            var nextHighway = osmLayer.features[i + 1];
            // process.stderr.write(nextHighway.geometry.type);
            var nextHighwayPoints = turf.explode(nextHighway);
            var highwayInside = turf.within(nextHighwayPoints, turf.featureCollection([bufferedHighway]));
            if (highwayInside.features.length > 0) {
                var remaining = osmLayer.features.splice(i + 1, 1);
                for (var r = 0; r < remaining.length; r++) {
                    if (remaining[r].geometry.type === 'LineString') {
                        singleDistance += turf.lineDistance(remaining[r], 'kilometers');
                    }
                }
            }
        }
    }
    result.push(singleDistance);

    for (var s = 0; s < osmLayer.features.length; s++) {
        if (osmLayer.features[s].properties.hasOwnProperty('toll') && osmLayer.features[s].properties['toll'] === 'yes' && osmLayer.features[s].geometry.type === 'LineString') {
            doubledistance += turf.lineDistance(osmLayer.features[s], 'miles');
        }
    }
    result.push(doubledistance);

    done(null, result);
};
