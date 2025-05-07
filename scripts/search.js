function inputSearch(){
    const inputValue = document.getElementById('user-input').value.toLowerCase();
    if (inputValue.length === 0){
        updateInputArea('hide', 'show');
        updateMainContent(initArray);
    } else if (inputValue.length >= 3){
        const filteredArray = initArray.filter(pokemon => pokemon.name.includes(inputValue));
        updateInputArea('hide', 'show');
        updateMainContent(filteredArray);
    } else {
        updateInputArea('show', 'hide');
    }
}

function updateInputArea(add, remove){
    document.getElementById('input-area-span').classList.add(add);
    document.getElementById('input-area-span').classList.remove(remove);
}

function updateMainContent(array){
    const mainRef = document.getElementById('main-content');
    mainRef.innerHTML = "";
    userSearch = array;
    renderCards();
}