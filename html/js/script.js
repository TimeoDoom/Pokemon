import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

// Vérification du bon chargement du DOM
$(document).ready(function () {
  // Charger les données
  Type.fill_types();
  Attack.fill_attacks();
  Pokemon.fill_pokemons();

  let currentPage = 1;
  const allPokemon = Object.values(Pokemon.all_pokemons);

  const prevBtn = $("button").first();
  const pageNum = $("#pagination span");
  const nextBtn = $("button").last();
  const typeInput = $("#listType").last();
  const attackInput = $("#fastAttackslist").last();
  const searchInput = $("#searchbar").last();

  let nameVal = null;
  let typeVal = "all";
  let attackVal = "all";
  let totalPages = 1;

  function displayTablePage(
    page,
    typeVal = "all",
    attackVal = "all",
    nameVal = "",
  ) {
    const pokemonTableBody = $("#pokeTable tbody");
    pokemonTableBody.empty();
    const elemPerPage = 25;

    let pagePokemon = allPokemon.slice();

    // Paramétrage recherche par type
    if (typeVal != "all") {
      pagePokemon = pagePokemon.filter((p) => {
        if (p.types.some((t) => t.name == typeVal)) {
          return p;
        }
      });
    } else {
      pagePokemon = pagePokemon.filter((p) => {
        if (p.types.some((t) => t.name.includes(""))) {
          return p;
        }
      });
    }

    // Paramétrage recherche par attaque
    if (attackVal != "all") {
      pagePokemon = pagePokemon.filter((p) => {
        if (p.attacks.fast.some((t) => t.name == attackVal)) {
          return p;
        }
      });
    } else {
      pagePokemon = pagePokemon.filter((p) => {
        if (p.types.some((t) => t.name.includes(""))) {
          return p;
        }
      });
    }

    // Paramétrage recherche par nom
    if (nameVal != null) {
      pagePokemon = pagePokemon.filter((p) =>
        p.name.toLowerCase().startsWith(nameVal.toLowerCase()),
      );
    }

    // Calcul du nombre de pages requises
    totalPages = Math.ceil(pagePokemon.length / elemPerPage);

    const start = (page - 1) * elemPerPage;
    const end = start + elemPerPage;
    pagePokemon = pagePokemon.slice(start, end);

    if (totalPages == 0) {
      console.log("Aucun éléments de trouvé");
    }

    // Affichage des pokémons en liste
    pagePokemon.forEach((pokemon) => {
      const pokemonIdFormatted = String(pokemon.id).padStart(3, "0");
      pokemonTableBody.append(`
        <tr data-pokemon-id="${pokemon.id}">
            <td>${pokemonIdFormatted}</td>
            <td>${pokemon.name}</td>
            <td>${pokemon.generation}</td>
            <td>${pokemon.types.map((t) => `<span class="type-${t.name.toLowerCase()}">${t.name}</span>`).join(", ")}</td>
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
      displayTablePage(currentPage, typeVal, attackVal, nameVal);
    }
  });

  nextBtn.on("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      localStorage.setItem("currentPage", currentPage);
      displayTablePage(currentPage, typeVal, attackVal, nameVal);
    }
  });

  function displayTypeList() {
    const typeList = $("#listType");
    typeList.empty();
    const all_type = Object.values(Type.all_types).sort();

    typeList.append(`<option value="all">Tout</option>`);
    all_type.forEach((type) => {
      typeList.append(`
        <option value="${type.name}">${type.name}</option>
    `);
    });
  }

  function displayFastAttackList() {
    const fastAttackslist = $("#fastAttackslist");
    fastAttackslist.empty();
    const fastAttacks = Object.values(Attack.all_attacks)
      .filter((attack) => attack.id >= 200)
      .sort((a, b) => a.name.localeCompare(b.name));

    fastAttackslist.append(`<option value="all">Tout</option>`);
    fastAttacks.forEach((attack) => {
      fastAttackslist.append(`
        <option value="${attack.name}">${attack.name}</option>
    `);
    });
  }

  typeInput.on("change", function () {
    typeVal = typeInput.val();
    console.log("type : " + typeVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  attackInput.on("change", function () {
    attackVal = attackInput.val();
    console.log("Attack : " + attackVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  searchInput.on("input", function () {
    nameVal = searchInput.val();
    console.log("search : " + nameVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  displayTablePage(1);
  displayTypeList();
  displayFastAttackList();
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
    pokemonTypes.html(
      pokemonInfo.types
        .map(
          (t) => `<span class="type-${t.name.toLowerCase()}">${t.name}</span>`,
        )
        .join(", "),
    );
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
