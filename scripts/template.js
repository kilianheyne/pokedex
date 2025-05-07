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

function overlayContainerTemplate(pokemonDetails, flavorText, evoChain){
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

function pokemonStatsTemplate(statName, statPercentage){
    return `<div class="stat-bar">
                        <span class="label">${statName.toUpperCase()}</span>
                        <div class="bar-bg">
                            <div class="bar-fill" style="width: ${statPercentage}%"></div>
                        </div>
                    </div>`
}

function singleEvolutionTemplate(evo){
    return `<div class="evo-step flexCo">
                            <img src="${evo.img}" alt="${evo.name}">
                            <div>${evo.name.toUpperCase()}</div>
                            <div>${evo.level ? 'at level ' + evo.level : '–'}</div>
                        </div>`
}