function createCard(location){
    var col = document.createElement('div');
    var card = document.createElement('div');
    var info = document.createElement('div');
    var additionInfo = document.createElement('div');
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
    additionInfo.innerHTML = '<p class="phone">' + location.

    if(location.opening_hours && location.opening_hours.open_now){
        info.innerHTML = info.innerHTML + '<p class="open-now"><i class="fa fa-clock-o" aria-hidden="true"></i>Open Now</p>';
    }

    card.appendChild(searchIcon);
    card.appendChild(info);
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
    this.classList.toggle('open');
    // Async get more details from Places library in Maps API
    getRestaurantDetails(this.getAttribute('id'))
}

// Async call to get full details on the restaurant a user clicked
function getRestaurantDetails(location){
    service.getDetails({ placeId: location }, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        return place;
      }
    }
}
