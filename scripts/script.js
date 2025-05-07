let initArray = [];
let userSearch = [];
const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
};

function init(){
    showLoadingGif();
    fetchData();
}

async function fetchData(){
    const offset = initArray.length; 
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${offset}`);
    const pokemonAsJSON = await pokemon.json();
    initArray.push(...pokemonAsJSON.results);
    userSearch = initArray;
    await renderCards(offset);
    hideLoadingGif();
}

async function renderCards(startIndex = 0){
    const contentRef = document.getElementById('main-content');
    for(i = startIndex; i < userSearch.length; i++ ){
        const pokeURL = userSearch[i].url;
        const detailResponse = await fetch(pokeURL);
        const pokemonDetails = await detailResponse.json()
        const primaryType = pokemonDetails.types[0].type.name;
        const bgColor = typeColors[primaryType] || '#f1f1f1';
        contentRef.innerHTML += cardsTemplate(pokemonDetails, bgColor);
    }
}

function renderTypes(details){
    let pokemonTypes = "";
    for (let type = 0; type < details.types.length; type++){
        const typeName = details.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type-${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

async function addNewData(){
    showLoadingGif();
    fetchData();
}

function showLoadingGif(){
    document.getElementById('loading-screen').classList.remove('hide');
    document.getElementById('loading-screen').style.zIndex = '9999';
}

function hideLoadingGif(){
    document.getElementById('loading-screen').classList.add('hide');
    document.getElementById('loading-screen').style.zIndex = '-1';
}