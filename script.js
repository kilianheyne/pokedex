let initArray = [];
let loadOffset = 0;
let userSearch = [];

function init(){
    fetchData();
}

async function fetchData(){
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let pokemonAsJSON = await pokemon.json();
    initArray.push(...pokemonAsJSON.results);
    userSearch = initArray;
    renderCards();
}

async function renderCards(){
    let contentRef = document.getElementById('main-content');
    for(i = 0; i < userSearch.length; i++ ){
        let detailResponse = await fetch(userSearch[i].url);
        let pokemonDetails = await detailResponse.json()
        contentRef.innerHTML += cardsTemplate(pokemonDetails);
    }
}

function cardsTemplate(pokemon){
    return `<div class="single-card">
                <div class="card-header">
                    <span class="header-number"># ${pokemon.id}</span>
                    <span class="header-name">${pokemon.name.toUpperCase()}</span>
                    <span></span>
                </div>
                <div class="card-image">
                    <img src="${pokemon.sprites.versions['generation-iii']['ruby-sapphire'].front_default}" alt="">
                </div>
                <div class="card-types">
                    ${renderTypes(pokemon)}
                </div>
            </div>`
}

function renderTypes(details){
    let pokemonTypes = "";
    for (let type = 0; type < details.types.length; type++){
        let typeName = details.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type-${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

function addNewData(){
    loadOffset += 25;
    initArray = [];
    fetchData();
}

function inputSearch(){
    let inputValue = document.getElementById('user-input').value.toLowerCase();
    if (inputValue.length === 0){
        updateInputArea(initArray, 'hide', 'show');
    } else if (inputValue.length >= 3){
        let filteredArray = initArray.filter(pokemon => pokemon.name.includes(inputValue));
        updateInputArea(filteredArray, 'hide', 'show');
    } else {
        updateInputArea(initArray, 'show', 'hide');
    }
}

function updateInputArea(array, add, remove){
    let mainRef = document.getElementById('main-content');
    mainRef.innerHTML = "";
    userSearch = array;
    renderCards();
    document.getElementById('input-area-span').classList.add(add);
    document.getElementById('input-area-span').classList.remove(remove);
}