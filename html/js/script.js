import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

// Vérification du bon chargement du DOM
$(document).ready(function () {
  // Charger les données
  Type.fill_types();
  Attack.fill_attacks();
  Pokemon.fill_pokemons();

  const allPokemon = Object.values(Pokemon.all_pokemons);
  const totalPages = Math.ceil(allPokemon.length / 25);
  let currentPage = 1;

  const prevBtn = $("button").first();
  const pageNum = $("#pagination span");
  const nextBtn = $("button").last();

  function displayTablePage(page) {
    const pokemonTableBody = $("#pokeTable tbody");
    pokemonTableBody.empty();
    const elemPerPage = 25;

    const start = (page - 1) * elemPerPage;
    const end = start + elemPerPage;

    const pagePokemon = allPokemon.slice(start, end);

    pagePokemon.forEach((pokemon) => {
      const pokemonIdFormatted = String(pokemon.id).padStart(3, "0");

      pokemonTableBody.append(`
        <tr>
            <td>${pokemonIdFormatted}</td>
            <td>${pokemon.name}</td>
            <td>${pokemon.generation}</td>
            <td>${pokemon.types.map((t) => t.name).join(", ")}</td>
            <td>${pokemon.stats.atk}</td>
            <td>${pokemon.stats.def}</td>
            <td><img src="./webp/images/${pokemonIdFormatted}.webp" alt="${pokemon.name}" style="width: 50px; height: 50px;"></td>
        </tr>
    `);
    });

    // Mettre à jour le numéro de page
    pageNum.text(`Page ${page}/${totalPages}`);

    // Désactiver les boutons si nécessaire
    prevBtn.prop("disabled", page === 1);
    nextBtn.prop("disabled", page === totalPages);
  }

  // Event listeners pour la pagination
  prevBtn.on("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayTablePage(currentPage);
    }
  });

  nextBtn.on("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayTablePage(currentPage);
    }
  });

  displayTablePage(1);
});
