/* CSIS 3380 Project by Takanori Hoshi (300306402) */

// Initialize the OpenLayers map
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

// Initialize the restaurant list
var vue = new Vue({
  el: '#list',
  data: {
    restaurants: []
  }
});

$('#refresh').click(fetchRestaurants);

fetchRestaurants();

// Fetch the restaurant list from Zomato API
function fetchRestaurants() {
  $('#refresh').addClass('disabled');
  map.getOverlays().clear();
  vue.restaurants = [];

  var headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('user-key', 'a4de784efbd48d9ad1c1a00a0c203e19');
  var params = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
  };

  var lonlat = ol.proj.toLonLat(map.getView().getCenter());
  var url = 'https://developers.zomato.com/api/v2.1/search?' +
    'lat=' + lonlat[1] + '&lon=' + lonlat[0] + '&start=0&sort=real_distance';
  fetch(url, params)
    .then(resp => resp.json())
    .then(json => fetchDone(json))
    .catch(err => {
      $('#refresh').removeClass('disabled');
      alert('Failed to fetch restaurants: ' + err);
    });
}

// Fetch done
function fetchDone(json) {
  $('#refresh').removeClass('disabled');
  json.restaurants.forEach(elem => {
    addMarker(elem.restaurant.id, elem.restaurant.location);
    vue.restaurants.push(elem.restaurant);
    setEventHandlers(elem.restaurant.id, elem.restaurant.name);
  });
}

// Add marker for each restaurant on the map
function addMarker(id, location) {
  var position = ol.proj.fromLonLat([parseFloat(location.longitude), parseFloat(location.latitude)]);
  var element = document.createElement('div');
  element.innerHTML = '<img id="pin' + id + '" src="img/pin.png">';
  var marker = new ol.Overlay({
    position: position,
    positioning: 'bottom-center',
    element: element,
    stopEvent: false
  });
  map.addOverlay(marker);
}

// Set click event handler and tooltip for the marker
function setEventHandlers(id, name) {
  $('#pin' + id)
    .click(() => {
      var top = $('#list').scrollTop() + $('#div' + id).position().top;
      $('#list').animate({ scrollTop: top }, () => {
        $('#div' + id).fadeOut().fadeIn();
      });
    })
    .attr('data-toggle', 'tooltip')
    .attr('title', name)
    .tooltip();
}
