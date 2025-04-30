let loadOffset = 0;

function init(){
    fetchFirstPokemon();
}

async function fetchFirstPokemon(){
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let pokemonAsJSON = await pokemon.json();
    let initArray = pokemonAsJSON.results;
    console.log(initArray);
    let contentRef = document.getElementById('main-content');
    for(i = 0; i < initArray.length; i++ ){
        let detailResponse = await fetch(initArray[i].url);
        let pokemonDetails = await detailResponse.json()
        console.log(pokemonDetails);
        contentRef.innerHTML += renderPokemonCards(pokemonDetails);
    }
}

function renderPokemonCards(pokemon){
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
                    ${renderPokemonTypes(pokemon)}
                </div>
            </div>`
}

function renderPokemonTypes(details){
    let pokemonTypes = "";
    for (let type = 0; type < details.types.length; type++){
        let typeName = details.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type-${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

function addNewPokemons(){
    loadOffset += 25;
    fetchFirstPokemon();
}