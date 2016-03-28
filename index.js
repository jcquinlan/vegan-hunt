var map, service, infowindow;

var searchTerm = 'therapy';

var wrapper = document.getElementById('cards');

var markerList = [],
    resultsList = [];

var currentLocation = {lat: 40.298, lng: -75.134};

// Creates the map, and assigns it a beginning location + search term
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 10
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // This just shows the hardcoded start location until a user searches
    initGUI();
    // searchMap takes a location, a radius, and search term
    searchMap(currentLocation, 5000, searchTerm);
    getLocation();
}

function initGUI(){
    var input = document.getElementById('loc-search');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // adds event listener to GUI so that location updates when selected
    autocomplete.addListener('place_changed', function() {
      destroyCards();
      clearMarkers();

      var place = autocomplete.getPlace();

      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(20);
      }

      // Searches the map automatically when a new location is selected
      searchMap(place.geometry.location, 10000, searchTerm);
    });
}

function searchMap(loc, dist, keyword){
    service.nearbySearch({
        location: loc,
        radius: dist,
        keyword: keyword,
        type:['doctor']
    }, handleResults);
}

function handleResults(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        storeResults(results);
        addMarkers();
        resultsList.forEach(function(location){
            createCard(location);
        });
    }
}

function storeResults(results) {
    for (var i = 0; i < results.length; i++) {
        resultsList.push(results[i]);
    }
}

function addMarkers(){
    for (var i = 0; i < resultsList.length; i++) {
        createMarker(resultsList[i]);
    }
}

function createMarker(result) {
  var marker = new google.maps.Marker({
      map: map,
      position: result.geometry.location
  });

  // Adds marker to array of markers so they can be handled later
  markerList.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(result.name + '<br /> ' + result.vicinity + ' ');
      infowindow.open(map, this);
  });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(logLocation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

//This will eventually get the users location using the HTML5 API
function logLocation(location){
    console.log(location.coords.latitude);
}

//Places all of the markers in the array onto the map
function populateMap(map){
    markerList.forEach(function(result){
        result.setMap(map);
        console.log('Marker changed.');
    });

}

//Gets rid of all the markers on the map
function clearMarkers(){
    populateMap(null);
    // Reset the array of markers to make ready for the new ones
    markerList = [];
    console.log('Markers removed.');
}
