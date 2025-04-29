function init(){
    fetchFirstPokemon();
}

async function fetchFirstPokemon(){
    let pokemon = await fetch("https://pokeapi.co/api/v2/pokemon?limit=25&offset=0");
    let pokemonAsJSON = await pokemon.json();
    let initArray = pokemonAsJSON.results;
    console.log(initArray);
    let contentRef = document.getElementById('main-content');
    for(i = 0; i < initArray.length; i++ ){
        contentRef += renderPokemonCards(i);
    }
}

function renderPokemonCards(cardIndex){
    return `<div class="single-card">
                <div>
                    <span>ID</span>
                    <span>${initArray.name}</span>
                </div>
                <div>
                    <img src="" alt="">
                </div>
                <div>
                    <span>Pokemon-Typen</span>
                </div>
            </div>`
}