const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const TYPE_API_URL = "https://pokeapi.co/api/v2/type/";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];



document.getElementById("searchButton").addEventListener("click", function () {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>로딩 중...</p>";
  
  fetch(`${API_URL}${searchValue}`)
    .then(response => {
      if (!response.ok) throw new Error("포켓몬을 찾을 수 없습니다.");
      return response.json();
    })
    .then(data => {
      console.log(data);
      resultDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>타입: ${data.types.map(t => t.type.name).join(", ")}</p>
        <p>공격: ${data.stats[1].base_stat}</p>
        <p>방어: ${data.stats[2].base_stat}</p>
        <p>속도: ${data.stats[5].base_stat}</p>
        <button onclick="addToFavorites('${data.name}')">즐겨찾기 추가</button>
      `;
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>${error.message}</p>`;
    });
});

document.getElementById("filterButton").addEventListener("click", function () {
  const type = document.getElementById("typeFilter").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>로딩 중...</p>";
  
  if (!type) {
    resultDiv.innerHTML = `<p>타입을 선택하세요.</p>`;
    return;
  }

  fetch(`${TYPE_API_URL}${type}`)
    .then(response => response.json())
    .then(data => {
      const pokemonList = data.pokemon.slice(0, 10);
      resultDiv.innerHTML = pokemonList.map(p => `<p>${p.pokemon.name}</p>`).join("");
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>${error.message}</p>`;
    });
});

function addToFavorites(name) {
  if (!favorites.includes(name)) {
    favorites.push(name);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesList();
  }
}

function updateFavoritesList() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = favorites.map(name => `<li>${name}</li>`).join("");
}

updateFavoritesList();
