function createCard(location){
    var item = document.createElement('div');
    item.classList.add('col-lg-3');
    item.classList.add('col-sm-4');
    item.innerHTML = location.name;
    wrapper.appendChild(item);
}

function destroyCards(){
    while(wrapper.hasChildNodes()){
        wrapper.removeChild(wrapper.childNodes[0]);
    }
}
