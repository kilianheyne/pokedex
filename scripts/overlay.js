async function openOverlay(pokemonId){
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const urlResponse = await fetch(url);
    const urlDetails = await urlResponse.json()
    const flavorText = await returnFlavorText(urlDetails);
    const evoChain = await returnEvolutions(urlDetails);
    const overlayRef = adjustOverlay();
    
    overlayRef.innerHTML += overlayContainerTemplate(urlDetails, flavorText, evoChain);
    updateNextBtn(pokemonId);
    updatePrevBtn(pokemonId);
}

function adjustOverlay(){
    const overlayRef = document.getElementById('overlay');
    overlayRef.innerHTML = "";
    overlayRef.style.zIndex = "15";
    overlayRef.classList.remove('hide');
    overlayRef.classList.add('show');
    document.body.style.overflow = "hidden";
    return overlayRef;
}

function closeOverlay(){
    const overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('show');
    overlayRef.classList.add('hide');
    overlayRef.style.zIndex = "-5";
    document.body.style.overflow = "auto";
}

function returnTypesOverlay(details){
    let pokemonTypes = "";
    for (let type = 0; type < details.types.length; type++){
        const typeName = details.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type-${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

async function returnFlavorText(details){
    const textResponse = await fetch(details.species.url);
    const textData = await textResponse.json();
    const englishText = textData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text;
    const finalEnglishText = englishText.replace(/[\n\f\r]/g, ' ');
    return finalEnglishText;
}

function returnPokemonStats(details){
    let baseStats = "";
    for(let i = 0; i < details.stats.length; i++){
        const statName = details.stats[i].stat.name;
        const statPercentage = details.stats[i].base_stat / 2;
        baseStats += pokemonStatsTemplate(statName, statPercentage);
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
        const nextEvo = await fetchEvolutionSteps(stepDetails.evolves_to[0]);
        evoSteps = evoSteps.concat(nextEvo);
    }
    return evoSteps;
}

async function fetchImageByName(pokeName){
    const imgResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    const imgData = await imgResponse.json();
    return imgData.sprites.versions['generation-iii']['ruby-sapphire'].front_default;
}

async function returnEvolutions(evoDetails){
    const evoChain = await fetchEvolutionData(evoDetails);
    const evolutions = await fetchEvolutionSteps(evoChain);
    let evolutionRoad = "";
    for(let i = 0; i < evolutions.length; i++){
        const evo = evolutions[i];
        evolutionRoad += singleEvolutionTemplate(evo);
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
    const abilityNames = getAbilityNames(details);
    const generalInfo = `<div><strong>Größe:</strong> ${height} m</div>
                    <div><strong>Gewicht:</strong> ${weight} kg</div>
                    <div><strong>Basis-Erfahrung:</strong> ${baseXp}</div>
                    <div><strong>Fähigkeiten:</strong> ${abilityNames}</div>`;
    return generalInfo;
}

function getAbilityNames(details){
    const abilities = details.abilities;
    let abilityNames = "";
    for(i = 0; i < abilities.length; i++){
        if (i > 0) {
            abilityNames += ", ";
        }
        abilityNames += abilities[i].ability.name;
    }
    return abilityNames;
}

function switchTab(tabName) {
    const contents = ['base-stats', 'evo-chain', 'general-info'];
    const tabIds = ['base-stats-tab', 'evo-chain-tab', 'general-info-tab'];

    for (let i = 0; i < contents.length; i++) {
        if (contents[i] === tabName) {
            activeTabStyle(contents[i], tabIds[i]);
        } else {
            pausedTabStyle(contents[i], tabIds[i]);
        }
    }
}

function activeTabStyle(contentId, tabId){
    document.getElementById(contentId).classList.replace('hide', 'show');
    document.getElementById(tabId).classList.add('active-tab');
}

function pausedTabStyle(contentId, tabId){
    document.getElementById(contentId).classList.replace('show', 'hide');
    document.getElementById(tabId).classList.remove('active-tab');
}

async function showNextPokemon(currentId){
    const nextId = currentId + 1;
    if(nextId > 1025) return; //aktuell maximale Anzahl an Pokémon
    const alreadyInArray = initArray.find(pokemon => extractIdFromUrl(pokemon.url) === nextId);
    if(!alreadyInArray) return;
    openOverlay(nextId);
    updateNextBtn(currentId);
}

function updateNextBtn(Id){
    const btnRef = document.getElementById('next-btn');
    if (Id == initArray.length){
        btnRef.classList.add('disabled');
        btnRef.setAttribute('disabled', 'true');
    }else{
        btnRef.classList.remove('disabled');
        btnRef.removeAttribute('disabled');
    }
}

async function showPreviousPokemon(currentId){
    const previousId = currentId - 1; 
    if(previousId < 1) return;
    openOverlay(previousId);
    updatePrevBtn(previousId);
}

function updatePrevBtn(Id){
    const btnRef = document.getElementById('prev-btn');
    if(Id <= 1){
        btnRef.classList.add('disabled');
        btnRef.setAttribute('disabled', 'true');
    }else{
        btnRef.classList.remove('disabled');
        btnRef.removeAttribute('disabled');
    }
}

function extractIdFromUrl(url) {
    const parts = url.split('/').filter(part => part);
    return parseInt(parts[parts.length - 1]);
}