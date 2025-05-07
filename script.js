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
    let offset = initArray.length; 
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${offset}`);
    let pokemonAsJSON = await pokemon.json();
    initArray.push(...pokemonAsJSON.results);
    userSearch = initArray;
    await renderCards(offset);
    hideLoadingGif();
}

async function renderCards(startIndex = 0){
    let contentRef = document.getElementById('main-content');
    for(i = startIndex; i < userSearch.length; i++ ){
        let pokeURL = userSearch[i].url;
        let detailResponse = await fetch(pokeURL);
        let pokemonDetails = await detailResponse.json()
        let primaryType = pokemonDetails.types[0].type.name;
        let bgColor = typeColors[primaryType] || '#f1f1f1';
        contentRef.innerHTML += cardsTemplate(pokemonDetails, bgColor);
    }
}

function cardsTemplate(pokemon, bgColor){
    return `<div class="single-card" onclick="openOverlay(${pokemon.id})" style="--type-bg-color: ${bgColor}">
                <div class="card-header">
                    <h2 class="header-name">${pokemon.name.toUpperCase()}</h2>
                    <span class="header-number"># ${pokemon.id}</span>
                </div>
                <div class="card-image">
                    <img class="pokemon-static" src="${pokemon.sprites.versions['generation-iii']['ruby-sapphire'].front_default}" alt="${pokemon.name}">
                    <img class="pokemon-gif" src="${pokemon.sprites.other.showdown.front_default}" alt="${pokemon.name}">
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

async function addNewData(){
    showLoadingGif();
    fetchData();
}

function inputSearch(){
    let inputValue = document.getElementById('user-input').value.toLowerCase();
    if (inputValue.length === 0){
        updateInputArea('hide', 'show');
        updateMainContent(initArray);
    } else if (inputValue.length >= 3){
        let filteredArray = initArray.filter(pokemon => pokemon.name.includes(inputValue));
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
    let mainRef = document.getElementById('main-content');
    mainRef.innerHTML = "";
    userSearch = array;
    renderCards();
}

async function openOverlay(pokemonId){
    showLoadingGif();
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let urlResponse = await fetch(url);
    let urlDetails = await urlResponse.json()
    let overlayRef = document.getElementById('overlay');
    let flavorText = await returnFlavorText(urlDetails);
    let evoChain = await returnEvolutions(urlDetails);
    overlayRef.innerHTML = "";
    overlayRef.style.zIndex = "15";
    overlayRef.classList.remove('hide');
    overlayRef.classList.add('show');
    overlayRef.innerHTML += renderOverlayContainer(urlDetails, flavorText, evoChain);
    document.body.style.overflow = "hidden";
    hideLoadingGif();
}

function closeOverlay(){
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('show');
    overlayRef.classList.add('hide');
    overlayRef.style.zIndex = "-5";
    document.body.style.overflow = "auto";
}

function renderOverlayContainer(pokemonDetails, flavorText, evoChain){
    return `<div id="overlay-container" onclick="event.stopPropagation()">
                <div id="overlay-header">
                    <span># ${pokemonDetails.id}</span>
                    <h2>${pokemonDetails.name.toUpperCase()}</h2>
                    <button class="close-overlay" onclick="closeOverlay()">X</button>
                </div>
                <div id="overlay-pokemon-details">
                    <div id="pokemon-info">
                        <div>
                            ${flavorText}
                        </div>
                        <div class="show" id="info-tabs">
                            <div id="base-stats-tab" class="active-tab" onclick="switchTab('base-stats')">Base Stats</div>
                            <div id="evo-chain-tab" onclick="switchTab('evo-chain')">Evolution Chain</div>
                            <div id="general-info-tab" onclick="switchTab('general-info')">General Information</div>
                        </div>
                        <div>
                            <div class="flexCo show" id="base-stats">
                                ${returnPokemonStats(pokemonDetails)}
                            </div>
                            <div class="hide" id="evo-chain">
                                ${evoChain}
                            </div>
                            <div class="hide" id="general-info">
                                ${getGeneralInfo(pokemonDetails)}
                            </div>
                        </div>
                    </div>
                    <div id="pokemon-visuals">
                        <img src="${pokemonDetails.sprites.other.showdown.front_default}" alt="">
                        <div>
                            ${returnTypesOverlay(pokemonDetails)}
                        </div>
                        <div class="overlay-navigation">
                                <button class="nav-btn" onclick="showPreviousPokemon(${pokemonDetails.id})">&#9664;</button>
                                <button class="nav-btn" onclick="showNextPokemon(${pokemonDetails.id})">&#9654;</button>
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

async function fetchEvolutionData(evoDetails){
    const speciesResponse = await fetch(evoDetails.species.url);
    const speciesData = await speciesResponse.json();

    const evoUrl = speciesData.evolution_chain.url;
    const evoResponse = await fetch(evoUrl);
    const evoData = await evoResponse.json();

    return evoData.chain;
}

async function fetchEvolutionSteps(stepDetails){
    let evoSteps = [];

    const evoName = stepDetails.species.name;
    const evoLevel = stepDetails.evolution_details?.[0]?.min_level ?? null;
    const evoImg = await fetchImageByName(evoName);

    evoSteps.push({name: evoName, level: evoLevel, img: evoImg});

    if(stepDetails.evolves_to.length > 0){
        let nextEvo = await fetchEvolutionSteps(stepDetails.evolves_to[0]);
        evoSteps = evoSteps.concat(nextEvo);
    }

    return evoSteps;
}

async function fetchImageByName(pokeName){
    let imgResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    let imgData = await imgResponse.json();
    return imgData.sprites.versions['generation-iii']['ruby-sapphire'].front_default;
}

async function returnEvolutions(evoDetails){
    const evoChain = await fetchEvolutionData(evoDetails);
    const evolutions = await fetchEvolutionSteps(evoChain);

    let evolutionRoad = "";
    for(let i = 0; i < evolutions.length; i++){
        let evo = evolutions[i];
        evolutionRoad += `<div class="evo-step flexCo">
                            <img src="${evo.img}" alt="${evo.name}">
                            <div>${evo.name.toUpperCase()}</div>
                            <div>${evo.level ? 'at level ' + evo.level : '–'}</div>
                        </div>`;
        if (i < evolutions.length - 1) {
            evolutionRoad += `<div class="evo-arrow">>>></div>`;
        }
    }
    return evolutionRoad; 
}

function getGeneralInfo(details){
    const height = details.height / 10;
    const weight = details.weight / 10;
    const baseXp = details.base_experience;
    const abilities = details.abilities;
    let abilityNames = "";
    for(i = 0; i < abilities.length; i++){
        if (i > 0) {
            abilityNames += ", ";
        }
        abilityNames += abilities[i].ability.name;
    }
    const generalInfo = `<div><strong>Größe:</strong> ${height} m</div>
                    <div><strong>Gewicht:</strong> ${weight} kg</div>
                    <div><strong>Basis-Erfahrung:</strong> ${baseXp}</div>
                    <div><strong>Fähigkeiten:</strong> ${abilityNames}</div>`;
    return generalInfo;
}

function switchTab(tabName) {
    let contents = ['base-stats', 'evo-chain', 'general-info'];
    let tabIds = ['base-stats-tab', 'evo-chain-tab', 'general-info-tab'];

    for (let i = 0; i < contents.length; i++) {
        let content = document.getElementById(contents[i]);
        let tab = document.getElementById(tabIds[i]);

        if (contents[i] === tabName) {
            content.classList.remove('hide');
            content.classList.add('show');
            tab.classList.add('active-tab');
        } else {
            content.classList.remove('show');
            content.classList.add('hide');
            tab.classList.remove('active-tab');
        }
    }
}

function showLoadingGif(){
    document.getElementById('loading-screen').classList.remove('hide');
    document.getElementById('loading-screen').style.zIndex = '9999';
}

function hideLoadingGif(){
    document.getElementById('loading-screen').classList.add('hide');
    document.getElementById('loading-screen').style.zIndex = '-1';
}

async function showNextPokemon(currentId){
    const nextId = currentId + 1;
    if(nextId > 1025) return; //aktuell maximale Anzahl an Pokémon
    const alreadyInArray = initArray.find(pokemon => extractIdFromUrl(pokemon.url) === nextId);
    if(!alreadyInArray){
        await fetchData();
    }
    await openOverlay(nextId);
}

async function showPreviousPokemon(currentId){
    const previousId = currentId - 1; 
    if(previousId < 1) return;
    await openOverlay(previousId);
}

function extractIdFromUrl(url) {
    const parts = url.split('/').filter(part => part);
    return parseInt(parts[parts.length - 1]);
}