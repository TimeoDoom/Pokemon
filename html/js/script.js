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
        <tr data-pokemon-id="${pokemon.id}">
            <td>${pokemonIdFormatted}</td>
            <td>${pokemon.name}</td>
            <td>${pokemon.generation}</td>
            <td>${pokemon.types.map((t) => t.name).join(", ")}</td>
            <td>${pokemon.stats.sta}</td>
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
      localStorage.setItem("currentPage", currentPage);
      displayTablePage(currentPage);
    }
  });

  nextBtn.on("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      localStorage.setItem("currentPage", currentPage);
      displayTablePage(currentPage);
    }
  });

  // Restaurer la page sauvegardée au chargement
  const savedPage = parseInt(localStorage.getItem("currentPage")) || 1;
  displayTablePage(savedPage);
  currentPage = savedPage;

  // ---------- POP UP ----------

  // Events Pop-up de détails
  const detailsPopUp = $(".overlay");
  const pokemonImage = $(".detailsPopUp img");
  const pokemonName = $(".detailsPopUp h2");
  const pokemonGeneration = $(".detailsPopUp .detailsInfos #gen");
  const pokemonTypes = $(".detailsPopUp .detailsInfos #types");
  const pokemonAttacksPoints = $(".detailsPopUp .detailsInfos #ptsAttk");
  const pokemonDefPoints = $(".detailsPopUp .detailsInfos #ptsDef");
  const pokemonAttacks = $(".detailsPopUp .detailsInfos #attks");

  $("#pokeTable").on("click", "tbody tr", function () {
    const pokemonId = $(this).data("pokemon-id");
    const pokemonInfo = Pokemon.all_pokemons[pokemonId];

    if (!pokemonInfo) {
      console.error(`Aucun Pokémon trouvé pour l'ID ${pokemonId}`);
      return;
    }

    const pokemonIdFormatted = String(pokemonId).padStart(3, "0");
    pokemonImage.attr("src", `./webp/images/${pokemonIdFormatted}.webp`);
    pokemonName.text(pokemonInfo.name);
    pokemonGeneration.text(pokemonInfo.generation);
    pokemonTypes.text(pokemonInfo.types.map((t) => t.name).join(", "));
    pokemonAttacksPoints.text(pokemonInfo.stats.atk);
    pokemonDefPoints.text(pokemonInfo.stats.def);
    pokemonAttacks.text(
      pokemonInfo.attacks.fast
        .filter((a) => a)
        .map((a) => a.name)
        .join(", "),
    );

    detailsPopUp.show();
  });

  // Fermer la pop-up en cliquant sur la croix
  $(".detailsPopUp .close").on("click", function () {
    detailsPopUp.hide();
  });

  // Fermer la pop-up en cliquant en dehors du contenu
  $(window).on("click", function (event) {
    if ($(event.target).is(detailsPopUp)) {
      detailsPopUp.hide();
    }
  });

  // ---------- SURVOL DES MINIATURES ----------

  const imagePopUp = $("#imagePopUp");
  const imagePopUpImg = imagePopUp.find("img");

  $("#pokeTable").on("mouseenter", "tbody tr", function () {
    const pokemonId = $(this).data("pokemon-id");
    const pokemonIdFormatted = String(pokemonId).padStart(3, "0");
    const imgSrc = `./webp/images/${pokemonIdFormatted}.webp`;

    imagePopUpImg.attr("src", imgSrc);
    imagePopUp.show();
  });

  $("#pokeTable").on("mouseleave", "tbody tr", function () {
    imagePopUp.hide();
  });
});
