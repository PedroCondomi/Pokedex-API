import {
  typeColors,
  colorModeDetails,
  setLanguageDetails,
  statNameMapping,
} from "./helper.js";
let currentPokemonId = null;
const MAX_POKEMONS = 1025;

const getLanguage = () => {
  return localStorage.getItem("language") || "en";
};

document.addEventListener("DOMContentLoaded", () => {
  getLanguage();
  setLanguageDetails();
  colorModeDetails();
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);

  const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map(sel =>
    document.querySelector(sel)
  );

  leftArrow.addEventListener("click", () => {
    let prevId = currentPokemonId - 1;
    if (prevId < 1) {
      prevId = MAX_POKEMONS;
    }
    navigatePokemon(prevId);
  });

  rightArrow.addEventListener("click", () => {
    let nextId = currentPokemonId + 1;
    if (nextId > MAX_POKEMONS) {
      nextId = 1;
    }
    navigatePokemon(nextId);
  });
});

const loadPokemon = async id => {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res =>
        res.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";
    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.log("An error has occured while fetching pokemon data: ", error);
    return false;
  }
};

const navigatePokemon = async id => {
  currentPokemonId = id;
  await loadPokemon(id);
};

const setElementStyle = (elements, cssProperty, value) => {
  elements.forEach(element => {
    element.style[cssProperty] = value;
  });
};

// Hex to rgb
const rgbaFromHex = hexColor => {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
};

const setTypeBackgroundColor = pokemon => {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyle([detailMainElement], "backgroundColor", color);
  setElementStyle([detailMainElement], "borderColor", color);
  setElementStyle(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );
  setElementStyle(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );
  setElementStyle(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
  .stats-wrap .progress-bar::-webkit-progress-bar {
    background-color: rgba(${rgbaColor}, 0.5);
  }
  .stats-wrap .progress-bar::-webkit-progress-value {
    background-color: ${color};
  }
  `;
  document.head.appendChild(styleTag);
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const createAndAppendElement = (parent, tag, options = {}) => {
  const element = document.createElement(tag);
  Object.keys(options).forEach(key => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
};

const getLocalizedName = (data, language) => {
  const nameEntry = data.names.find(entry => entry.language.name === language);
  return nameEntry ? nameEntry.name : data.name;
};

const getMovesAndTypes = async pokemon => {
  const { abilities, types } = pokemon;
  const language = getLanguage();
  const abilitiesNames = [];
  const typesNames = [];

  for (const { ability } of abilities) {
    try {
      const res = await fetch(ability.url);
      const abilityData = await res.json();
      const localizedName = getLocalizedName(abilityData, language);
      abilitiesNames.push(localizedName);
    } catch (err) {
      console.error("Failed to fetch ability: ", err);
    }
  }
  for (const { type } of types) {
    try {
      const res = await fetch(type.url);
      const typeData = await res.json();
      const localizedName = getLocalizedName(typeData, language);
      typesNames.push(localizedName);
    } catch (err) {
      console.error("Failed to fetch type: ", err);
    }
  }
  return { abilitiesNames, typesNames };
};

const displayPokemonDetails = async pokemon => {
  const { name, id, weight, height, stats } = pokemon;
  const { typesNames, abilitiesNames } = await getMovesAndTypes(pokemon);

  const language = setLanguageDetails();

  // Pokemon name
  const capitalizedName = capitalizeFirstLetter(name);
  document.querySelector("title").textContent = capitalizedName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());
  document.querySelector(".name-wrap .name").textContent = capitalizedName;
  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  // Pokemon img
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${id}.png`;
  imageElement.alt = name;

  // Pokemon types
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";

  typesNames.forEach(type => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type}`,
      textContent: type,
    });
  });

  // Weight, height and moves
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10} kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10} mts`;

  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );

  abilitiesNames.forEach(ability => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability,
    });
  });

  // Pokemon stats
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });
    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });
    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
};

const getEnglishFlavorText = pokemonSpecies => {
  // TODO Crear version en español
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === getLanguage()) {
      let flavor = entry.flavor_text.replace(/\f/g, "");
      return flavor;
    }
  }
  return "";
};
