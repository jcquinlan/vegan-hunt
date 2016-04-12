function createCard(location){
    var col = document.createElement('div');
    var card = document.createElement('div');
    var info = document.createElement('div');
    col.classList.add('col-lg-3');
    col.classList.add('col-sm-4');
    col.classList.add('col-xs-6');
    card.classList.add('card');
    card.setAttribute('loc', location.vicinity)
    card.addEventListener('click', selectCard);

    info.innerHTML = '<p class="location-name">' + location.name + '</p><p class="address">' + location.vicinity + '</p>';

    card.appendChild(info);
    col.appendChild(card);
    wrapper.appendChild(col);

    console.log(location);
}

function destroyCards(){
    while(wrapper.hasChildNodes()){
        wrapper.removeChild(wrapper.childNodes[0]);
        console.log(wrapper.childNodes.length);
    }
    resultsList = [];
    console.log('Cards destroyed');
}

function selectCard(event){
    var location = event.target.getAttribute('loc');
    console.log(location);
}
