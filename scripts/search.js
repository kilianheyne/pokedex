function inputSearch(){
    const inputValue = document.getElementById('user-input').value.toLowerCase();
    if (inputValue.length === 0){
        updateInputArea('hide', 'show');
        updateMainContent(initArray);
        toggleLoadMoreBtn(true);
    } else if (inputValue.length >= 3){
        const filteredArray = initArray.filter(pokemon => pokemon.name.includes(inputValue));
        updateInputArea('hide', 'show');
        updateMainContent(filteredArray);
        toggleLoadMoreBtn(false);
    } else {
        updateInputArea('show', 'hide');
        toggleLoadMoreBtn(false);
    }
}

function updateInputArea(add, remove, replace){
    document.getElementById('input-area-span').classList.add(add);
    document.getElementById('input-area-span').classList.remove(remove);
}

function updateMainContent(array){
    const mainRef = document.getElementById('main-content');
    mainRef.innerHTML = "";
    userSearch = array;
    if(array.length === 0){
        noResultsHint();
    }else{
        renderCards();
    }
}

function debounce(usedFunction, delay){
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => usedFunction.apply(this, args), delay);
    };
}

const debounceInputSearch = debounce(inputSearch, 400);

function noResultsHint(){
    const mainRef = document.getElementById('main-content');
    mainRef.innerHTML = `<div class="no-result-hint">
                            <p>Seems like you didn't catch that one so far. Go catch'em all!</p>
                        </div>`;
}

function toggleLoadMoreBtn(visible){
    const btnRef = document.getElementById('load-more-btn');
    if(visible){
        btnRef.style.display = 'flex';
    }else{
        btnRef.style.display = 'none';
    }
}