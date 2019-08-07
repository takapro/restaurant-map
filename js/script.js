var lonlat = [-122.9131, 49.2026];
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat(lonlat),
    zoom: 17
  })
});
