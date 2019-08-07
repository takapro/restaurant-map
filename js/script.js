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

fetchRestaurants();

function fetchRestaurants() {
  var headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('user-key', 'a4de784efbd48d9ad1c1a00a0c203e19');
  var params = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
  };
  var url = 'https://developers.zomato.com/api/v2.1/search?' +
    'lat=' + lonlat[1] + '&lon=' + lonlat[0] + '&start=0&sort=real_distance';
  fetch(url, params)
    .then(resp => resp.json())
    .then(json => fetchDone(json));
}

function fetchDone(json) {
  json.restaurants.forEach(elem => {
    var location = elem.restaurant.location;
    addMarker([parseFloat(location.longitude), parseFloat(location.latitude)]);
  });
}

function addMarker(lonlat) {
  var position = ol.proj.fromLonLat(lonlat);
  var element = document.createElement('div');
  element.innerHTML = '<img src="img/pin.png">';
  var marker = new ol.Overlay({
    position: position,
    positioning: 'bottom-center',
    element: element,
    stopEvent: false
  });
  map.addOverlay(marker);
}
