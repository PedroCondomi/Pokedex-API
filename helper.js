const darkmodeImg = document.querySelector("#darkmode-img");
const searchInput = document.querySelector("#search-input");
const sorter = document.querySelector("#sorter");
const nameLabel = document.querySelector("#name-label");
const numberLabel = document.querySelector("#number-label");
const notFoundMessage = document.querySelector("#not-found-message");
const docAbout = document.querySelector("#about");
const docWeight = document.querySelector("#weight");
const docHeight = document.querySelector("#height");
const docMove = document.querySelector("#move");
const docBaseStats = document.querySelector("#base-stats");
const height = document.querySelector("#heightIcon");
const weight = document.querySelector("#weightIcon");

let typeColors = [];

// Dark/Light mode
const darkMode = () => {
  return localStorage.getItem("darkmode") || "off";
};

const colorModeIndex = () => {
  const darkColor = darkMode();
  switch (darkColor) {
    case "on":
      darkmodeImg.src = `./assets/lightmode.svg`;
      document.documentElement.style.setProperty(
        "--identity-primary",
        "#b00824"
      );
      document.documentElement.style.setProperty("--grayscale-dark", "#d3cfca");
      document.documentElement.style.setProperty(
        "--grayscale-medium",
        "#a8a095"
      );
      document.documentElement.style.setProperty(
        "--grayscale-light",
        "#2a2d2f"
      );
      document.documentElement.style.setProperty(
        "--grayscale-background",
        "#212425"
      );
      document.documentElement.style.setProperty(
        "--grayscale-white",
        "#181a1b"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-dark",
        "#e7e3ddff"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-medium",
        "#a8a095"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "0px 1px 3px 1px rgba(255, 255, 255, 0.2)"
      );

      break;

    default:
      darkmodeImg.src = `./assets/darkmode.svg`;
      document.documentElement.style.setProperty(
        "--identity-primary",
        "#dc0a2d"
      );
      document.documentElement.style.setProperty("--grayscale-dark", "#212121");
      document.documentElement.style.setProperty(
        "--grayscale-medium",
        "#666666"
      );
      document.documentElement.style.setProperty(
        "--grayscale-light",
        "#e0e0e0"
      );
      document.documentElement.style.setProperty(
        "--grayscale-background",
        "#efefef"
      );
      document.documentElement.style.setProperty(
        "--grayscale-white",
        "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-dark",
        "#111111"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-medium",
        "#404040"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "0px 1px 3px 1px rgba(0, 0, 0, 0.2)"
      );

      break;
  }
};

const colorModeDetails = () => {
  const darkColor = darkMode();
  switch (darkColor) {
    case "on":
      height.src = `./assets/heightdark.svg`;
      weight.src = `./assets/weightdark.svg`;
      typeColors = {
        normal: "#545436",
        fire: "#ac4f0c",
        water: "#0e3289",
        electric: "#ae8e0dff",
        grass: "#5f902d",
        ice: "#337a7aff",
        fighting: "#9a2620",
        poison: "#803380",
        ground: "#644f14",
        flying: "#3f209bff",
        psychic: "#950631",
        bug: "#86931a",
        rock: "#93802d",
        ghost: "#5a467a",
        dragon: "#3506a9",
        dark: "#5a463a",
        steel: "#676f74ff",
        fairy: "#8c2f45ff",
      };
      document.documentElement.style.setProperty(
        "--identity-primary",
        "#b00824"
      );
      document.documentElement.style.setProperty("--grayscale-dark", "#d3cfca");
      document.documentElement.style.setProperty(
        "--grayscale-medium",
        "#a8a095"
      );
      document.documentElement.style.setProperty(
        "--grayscale-light",
        "#2a2d2f"
      );
      document.documentElement.style.setProperty(
        "--grayscale-background",
        "#212425"
      );
      document.documentElement.style.setProperty(
        "--grayscale-white",
        "#181a1b"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-dark",
        "#e7e3ddff"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-medium",
        "#a8a095"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "0px 1px 3px 1px rgba(255, 255, 255, 0.2)"
      );
      break;

    default:
      height.src = `./assets/height.svg`;
      weight.src = `./assets/weight.svg`;
      typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
      };
      document.documentElement.style.setProperty(
        "--identity-primary",
        "#dc0a2d"
      );
      document.documentElement.style.setProperty("--grayscale-dark", "#212121");
      document.documentElement.style.setProperty(
        "--grayscale-medium",
        "#666666"
      );
      document.documentElement.style.setProperty(
        "--grayscale-light",
        "#e0e0e0"
      );
      document.documentElement.style.setProperty(
        "--grayscale-background",
        "#efefef"
      );
      document.documentElement.style.setProperty(
        "--grayscale-white",
        "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-dark",
        "#111111"
      );
      document.documentElement.style.setProperty(
        "--text-grayscale-medium",
        "#404040"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "0px 1px 3px 1px rgba(0, 0, 0, 0.2)"
      );
      break;
  }
};

const toggleColorMode = () => {
  if (darkMode() === "off") {
    localStorage.setItem("darkmode", "on");
    colorModeIndex();
  } else {
    localStorage.setItem("darkmode", "off");
    colorModeIndex();
  }
};

// Languages
const getLanguage = () => {
  return localStorage.getItem("language") || "en";
};

const setLanguageIndex = () => {
  const lang = getLanguage();
  switch (lang) {
    case "en":
      sorter.textContent = "Sort by:";
      searchInput.placeholder = "Search";
      nameLabel.textContent = "Name";
      numberLabel.textContent = "Number";
      notFoundMessage.textContent = "Pokemon not found";
      break;
    case "es":
      sorter.textContent = "Ordernar por:";
      searchInput.placeholder = "Buscar";
      nameLabel.textContent = "Nombre";
      numberLabel.textContent = "Número";
      notFoundMessage.textContent = "Pokemon no encontrado";
      break;
  }
};

let statNameMapping = {};

const setLanguageDetails = () => {
  const lang = getLanguage();
  switch (lang) {
    case "en":
      docAbout.textContent = "About";
      docWeight.textContent = "Weight";
      docHeight.textContent = "Height";
      docMove.textContent = "Moves";
      docBaseStats.textContent = "Base Stats";
      statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
      };
      break;

    case "es":
      docAbout.textContent = "Información";
      docWeight.textContent = "Peso";
      docHeight.textContent = "Altura";
      docMove.textContent = "Movimientos";
      docBaseStats.textContent = "Estadísticas Base";
      statNameMapping = {
        hp: "PS",
        attack: "ATA",
        defense: "DEF",
        "special-attack": "ATA ES",
        "special-defense": "DEF ES",
        speed: "VEL",
      };
      break;
  }
};

export {
  colorModeIndex,
  colorModeDetails,
  toggleColorMode,
  setLanguageIndex,
  setLanguageDetails,
  getLanguage,
  typeColors,
  statNameMapping,
};
