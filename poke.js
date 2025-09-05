import {
  colorModeIndex,
  toggleColorMode,
  setLanguageIndex,
  getLanguage,
} from "./helper.js";

const MAX_POKEMON = 1025;
const closeButton = document.querySelector("#search-close-icon");
const listWrapper = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
const numberFilter = document.querySelector("#number");
const searchInput = document.querySelector("#search-input");
const langEs = document.querySelector("#spanish");
const langEn = document.querySelector("#english");
const darkmodeBtn = document.querySelector("#darkmode-btn");

document.addEventListener("DOMContentLoaded", () => {
  setLanguageIndex();
  colorModeIndex();
});

// store all pokemons
let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then(resp => resp.json())
  .then(data => {
    allPokemons = data.results;
    displayPokemon(allPokemons);
  });

langEs.addEventListener("click", () => {
  if (getLanguage() !== "es") {
    localStorage.setItem("language", "es");
    setLanguageIndex();
  }
});

langEn.addEventListener("click", () => {
  if (getLanguage() !== "en") {
    localStorage.setItem("language", "en");
    setLanguageIndex();
  }
});

darkmodeBtn.addEventListener("click", () => {
  toggleColorMode();
});

const fetchPokemonDataBeforeRedirect = async id => {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.log("Failed to fetch Pokemon data before redirect: " + error);
  }
};

const displayPokemon = pokemon => {
  listWrapper.innerHTML = "";
  // Creating the card
  pokemon.forEach(pokemon => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
    <div class="number-wrap">
        <p class="caption-fonts">#${pokemonID}</p>
    </div>
    <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}"/>
    </div>
    <div class="name-wrap">
        <p class="body3-fonts">${pokemon.name}</p>
    </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
};

const handleSearch = () => {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter(pokemon => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemon(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
};

searchInput.addEventListener("keyup", handleSearch);

closeButton.addEventListener("click", () => {
  searchInput.value = "";
  displayPokemon(allPokemons);
  notFoundMessage.style.display = "none";
});
