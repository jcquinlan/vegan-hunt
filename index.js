// Init the global variables - these will be wrapped later
var map, service, infowindow;
var searchTerm = 'vegan';
var wrapper = document.getElementById('cards');
var markerList = [],
    resultsList = [];
var currentLocation = {lat: 34.298, lng: -85.134};

// Creates the map, and assigns it a beginning location + search term
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 12,
    });
    map.setOptions({ styles: mapStyles });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // This just shows the hardcoded start location until a user searches
    initGUI();
    // searchMap takes a location, a radius, and search term
    searchMap(currentLocation, 5000, searchTerm);
    getLocation();
}


// Sets up Google's GUI for the map
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


// Actually makes the call to the API to recieve a list of the locations
function searchMap(loc, dist, keyword){
    service.nearbySearch({
        location: loc,
        radius: dist,
        keyword: keyword,
        type:['restaurant']
    }, handleResults);
}


// Callback that is executed after the async API call
function handleResults(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        storeResults(results);
        addMarkers();
        updateResultsNumber();
        resultsList.forEach(function(location){
            createCard(location);
        });
    }
}

function updateResultsNumber(){
    var resultsNum = document.getElementById('results-number');
    resultsNum.innerHTML = resultsList.length;
}


// Store the results of the API call in a global array
function storeResults(results) {
    for (var i = 0; i < results.length; i++) {
        resultsList.push(results[i]);
    }
}


// Create marker for each location
function addMarkers(){
    for (var i = 0; i < resultsList.length; i++) {
        createMarker(resultsList[i]);
    }
}


// Create one marker for one location
function createMarker(result) {
  var marker = new google.maps.Marker({
      map: map,
      position: result.geometry.location
  });

  // Adds marker to array of markers so they can be handled later
  markerList.push(marker);


  google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.setContent(result.name + '<br /> ' + result.vicinity + ' ');
      infowindow.open(map, this);
  });

  google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close(map, this);
  });
}

// Gets current location of the user
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




///////////////////////////////////////////////////////////////////
///////////////// Location JavaScript ////////////////////////////
/////////////////////////////////////////////////////////////////




function createCard(location){
    var col = document.createElement('div');
    var card = document.createElement('div');
    var info = document.createElement('div');
    var additionalInfo = document.createElement('div');
    var searchIcon = document.createElement('i');

    searchIcon.classList.add('fa');
    searchIcon.classList.add('fa-plus');
    additionalInfo.classList.add('additional-info');

    col.classList.add('col-lg-3');
    col.classList.add('col-sm-4');
    col.classList.add('col-xs-6');
    card.classList.add('card');

    card.setAttribute('id', location.place_id);
    searchIcon.setAttribute('q', location.name + ' ' + location.vicinity);

    searchIcon.addEventListener('click', selectCard, true);
    card.addEventListener('click', openCard);

    info.innerHTML = '<p class="location-name">' + location.name + '</p><p class="address">' + location.vicinity + '</p>';
    additionalInfo.innerHTML = '<p class="rating">' + location.rating;

    if(location.opening_hours && location.opening_hours.open_now){
        info.innerHTML = info.innerHTML + '<p class="open-now"><i class="fa fa-clock-o" aria-hidden="true"></i>Open Now</p>';
    }

    card.appendChild(searchIcon);
    card.appendChild(info);
    card.appendChild(additionalInfo);
    col.appendChild(card);
    wrapper.appendChild(col);

    console.log(location);
}

// Removes all the cards from the UI
function destroyCards(){
    while(wrapper.hasChildNodes()){
        wrapper.removeChild(wrapper.childNodes[0]);
        console.log(wrapper.childNodes.length);
    }
    resultsList = [];
    console.log('Cards destroyed');
}

// Executed when a card is clicked
function selectCard(event){
    event.stopPropagation();
    var q = event.target.getAttribute('q');
    window.open('https://google.com/search?q=' + q);
}

// This function is run when a card is clicked and expanded
function openCard(event){
    var elem = this;
    elem.classList.toggle('open');

    if(elem.className.indexOf('open') != -1){
        // Async get more details from Places library in Maps API
        getRestaurantDetails(this.getAttribute('id'), elem);
    }
}

// Async call to get full details on the restaurant a user clicked
function getRestaurantDetails(location, element){
    var additionalInfo = element.querySelector('.additional-info')
    service.getDetails({ placeId: location }, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(place);
        additionalInfo.innerHTML += '<p>' + place.website + '</p>';
        additionalInfo.innerHTML += '<p>' + place.formatted_phone_number + '</p>';
      }
    }
}
