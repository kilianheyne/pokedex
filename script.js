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
        let pokeURL = userSearch[i].url;
        let detailResponse = await fetch(pokeURL);
        let pokemonDetails = await detailResponse.json()
        contentRef.innerHTML += cardsTemplate(pokemonDetails, pokeURL);
    }
}

function cardsTemplate(pokemon, pokeURL){
    return `<div class="single-card" onclick="openOverlay('${pokeURL}')">
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

async function openOverlay(url){
    let urlResponse = await fetch(url);
    let urlDetails = await urlResponse.json()
    let overlayRef = document.getElementById('overlay');
    let flavorText = await returnFlavorText(urlDetails);
    overlayRef.innerHTML = "";
    overlayRef.style.zIndex = "15";
    overlayRef.classList.remove('hide');
    overlayRef.classList.add('show');
    overlayRef.innerHTML += renderOverlayContainer(urlDetails, flavorText);
}

function closeOverlay(){
    let overlayRef = document.getElementById('overlay');
    overlayRef.style.zIndex = "-5";
    overlayRef.classList.remove('show');
    overlayRef.classList.add('hide');
}

function renderOverlayContainer(pokemonDetails, flavorText){
    return `<div id="overlay-container">
                <div id="overlay-header">
                    <span># ${pokemonDetails.id}</span>
                    <span>${pokemonDetails.name.toUpperCase()}</span>
                    <button class="close-overlay" onclick="closeOverlay()">X</button>
                </div>
                <div id="overlay-pokemon-details">
                    <div id="pokemon-visuals">
                        <div><img src="${pokemonDetails.sprites.versions['generation-iii']['ruby-sapphire'].front_default}" alt=""></div>
                        <div>
                            ${returnTypesOverlay(pokemonDetails)}
                        </div>
                    </div>
                    <div id="pokemon-info">
                        <div>
                            ${flavorText}
                        </div>
                        <div class="show" id="info-tabs">
                            <div>Base Stats</div>
                            <div>Evolution Chain</div>
                            <div>General Information</div>
                        </div>
                        <div>
                            <div class="flexCo" id="base-stats">
                                ${returnPokemonStats(pokemonDetails)}
                            </div>
                            <div>
                                Hier findest Du die verschiedenen Entwicklung mit Level

                            </div>
                            <div>
                                Hier findest Du die allgemeinen Informationen zu einem Pokémon
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

function returnTypesOverlay(details){
    let pokemonTypes = "";
    for (let type = 0; type < details.types.length; type++){
        let typeName = details.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type-${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

async function returnFlavorText(details){
    let textResponse = await fetch(details.species.url);
    let textData = await textResponse.json();
    let englishText = textData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text;
    let finalEnglishText = englishText.replace(/[\n\f\r]/g, ' ');
    return finalEnglishText;
}

function returnPokemonStats(details){
    let baseStats = "";
    for(let i = 0; i < details.stats.length; i++){
        let statName = details.stats[i].stat.name;
        let statPercentage = details.stats[i].base_stat / 2;
        baseStats += `<div class="stat-bar">
                        <span class="label">${statName.toUpperCase()}</span>
                        <div class="bar-bg">
                            <div class="bar-fill" style="width: ${statPercentage}%"></div>
                        </div>
                    </div>`
    }
    return baseStats;
}

async function returnEvolutions(){
    let evoResponse = await fetch(details.species.url);
    console.log(evoResponse);
    
}