function createCard(location){
    var col = document.createElement('div');
    var card = document.createElement('div');
    col.classList.add('col-lg-3');
    col.classList.add('col-sm-4');
    col.classList.add('col-xs-6');
    card.classList.add('card');

    card.innerHTML = location.name;

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
