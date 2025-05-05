let initArray = [];
let userSearch = [];

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

async function addNewData(){
    showLoadingGif();
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
    let evoChain = await returnEvolutions(urlDetails);
    overlayRef.innerHTML = "";
    overlayRef.style.zIndex = "15";
    overlayRef.classList.remove('hide');
    overlayRef.classList.add('show');
    overlayRef.innerHTML += renderOverlayContainer(urlDetails, flavorText, evoChain);
}

function closeOverlay(){
    let overlayRef = document.getElementById('overlay');
    overlayRef.style.zIndex = "-5";
    overlayRef.classList.remove('show');
    overlayRef.classList.add('hide');
}

function renderOverlayContainer(pokemonDetails, flavorText, evoChain){
    return `<div id="overlay-container">
                <div id="overlay-header">
                    <span># ${pokemonDetails.id}</span>
                    <span>${pokemonDetails.name.toUpperCase()}</span>
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
                        <div><img src="${pokemonDetails.sprites.versions['generation-iii']['ruby-sapphire'].front_default}" alt=""></div>
                        <div>
                            ${returnTypesOverlay(pokemonDetails)}
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