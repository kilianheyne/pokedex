let initArray = [];
let loadOffset = 0;

function init(){
    fetchData();
}

async function fetchData(){
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let pokemonAsJSON = await pokemon.json();
    initArray.push(...pokemonAsJSON.results);
    renderCards();
}

async function renderCards(){
    let contentRef = document.getElementById('main-content');
    for(i = 0; i < initArray.length; i++ ){
        let detailResponse = await fetch(initArray[i].url);
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
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/${pokemon.id}.png" alt="">
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