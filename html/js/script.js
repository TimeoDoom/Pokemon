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

  // Vairables définissant les différents éléments de champs et d'interactions 
  const prevBtn = $("button").first();
  const pageNum = $("#pagination span");
  const nextBtn = $("button").last();
  const typeInput = $("#listType").last();
  const attackInput = $("#fastAttackslist").last();
  const searchInput = $("#searchbar").last();

  // Variables définissant les colonnes du tableau
  const ptsDefBase = $("tr > td:contains('Points de défense de base')").last();
  const ptsAtcksBase = $('tr > td:contains("Points d\'attaque de base")').last();
  const endurance = $('tr > td:contains("Endurance")').last();
  const types = $('tr > td:contains("Types")').last();
  const generation = $('tr > td:contains("Génération")').last();
  const nom = $('tr > td:contains("Nom")').last();
  const identifiant = $('tr > td:contains("Identifiant")').last();

  // Variables définissant la valeur de la recherche associés de chaque attributs
  let nameVal = null;
  let typeVal = "all";
  let attackVal = "all";

  // Variable définissant la valeur du tri de chaque attributs
  let triPtsDefBase = 0;
  let triPtsAtcksBase = 0;
  let triEndurance = 0;
  let triTypes = 0;
  let triGeneration = 0;
  let triNom = 0;
  let triIdentifiant = 0;

  let totalPages = 1;

  function displayTablePage(page, typeVal = "all", attackVal = "all", nameVal = "", triPtsDefBase = 0, triPtsAtcksBase = 0, triEndurance = 0, triTypes = 0, triGeneration = 0, triNom = 0, triIdentifiant = 0) {
    const pokemonTableBody = $("#pokeTable tbody");
    pokemonTableBody.empty();
    const elemPerPage = 25;

    let pagePokemon = allPokemon.slice();

    // Paramétrage recherche par type
    if(typeVal != "all") {
      pagePokemon = pagePokemon.filter((p) => {
        if(p.types.some((t) => t.name == typeVal)) {
          return p;
        }
      });
    } else {
      pagePokemon = pagePokemon.filter((p) => {
        if(p.types.some((t) => t.name.includes(""))) {
          return p;
        }
      });
    }

    // Paramétrage recherche par attaque
    if(attackVal != "all") {
      pagePokemon = pagePokemon.filter((p) => {
        if(p.attacks.fast.some((t) => t.name == attackVal)) {
          return p;
        }
      });
    } else {
      pagePokemon = pagePokemon.filter((p) => {
        if(p.types.some((t) => t.name.includes(""))) {
          return p;
        }
      });
    }

    // Paramétrage recherche par nom
    if(nameVal != null) {
      pagePokemon = pagePokemon.filter((p) => p.name.toLowerCase().startsWith(nameVal.toLowerCase()));
    }

    // tri sur les points de défense de base
    if(triPtsDefBase == 1) {
      pagePokemon.sort((p1, p2) => {
        return p1.stats.def - p2.stats.def;
      })
    } else if(triPtsDefBase == 2) {
      pagePokemon.sort((p1, p2) => {
        return p2.stats.def - p1.stats.def;
      })
    } 

    // tri sur les points d'attaque de base
    if(triPtsAtcksBase == 1) {
      pagePokemon.sort((p1, p2) => {
        return p1.stats.atk - p2.stats.atk;
      })
    } else if(triPtsAtcksBase == 2) {
      pagePokemon.sort((p1, p2) => {
        return p2.stats.atk - p1.stats.atk;
      })
    } 
  
    // tri sur l'endurance
    if(triEndurance == 1) {
      pagePokemon.sort((p1, p2) => {
        return p1.stats.sta - p2.stats.sta;
      })
    } else if(triEndurance == 2) {
      pagePokemon.sort((p1, p2) => {
        return p2.stats.sta - p1.stats.sta;
      })
    } 

    // tri sur la génération
    if(triGeneration == 1) {
      pagePokemon.sort((p1, p2) => {
        return p1.generation - p2.generation;
      })
    } else if(triGeneration == 2) {
      pagePokemon.sort((p1, p2) => {
        return p2.generation - p1.generation;
      })
    } 

    // tri sur l'ID
    if(triIdentifiant == 1) {
      pagePokemon.sort((p1, p2) => {
        return p1.id - p2.id;
      })
    } else if(triIdentifiant == 2) {
      pagePokemon.sort((p1, p2) => {
        return p2.id - p1.id;
      })
    } 

    // tri sur le nomm
    if(triNom == 1) {
      pagePokemon.sort((p1, p2) => p1.name.localeCompare(p2.name));
    } else if(triNom == 2) {
      pagePokemon.sort((p1, p2) => p2.name.localeCompare(p1.name));
    }

    // tri sur les types
    if(triTypes == 1) {
      pagePokemon.sort((p1, p2) => p1.types[0].name.localeCompare(p2.types[0].name));
    } else if(triTypes == 2) {
      pagePokemon.sort((p1, p2) => p2.types[0].name.localeCompare(p1.types[0].name));
    }
    
    // Calcul du nombre de pages requises
    totalPages = Math.ceil(pagePokemon.length / elemPerPage);

    const start = (page - 1) * elemPerPage;
    const end = start + elemPerPage;
    pagePokemon = pagePokemon.slice(start, end);

    if(totalPages == 0) {
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
    let all_type = Object.values(Type.all_types);

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
    // console.log("type : " + typeVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  attackInput.on("change", function () {
    attackVal = attackInput.val();
    // console.log("Attack : " + attackVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  searchInput.on("input", function () {
    nameVal = searchInput.val();
    // console.log("search : " + nameVal);
    displayTablePage(currentPage, typeVal, attackVal, nameVal);
  });

  ptsDefBase.on("click", function () {
    // Alterne le tri de la défense de base : croissant, décroissant, puis désactivé.
    switch (triPtsDefBase) {
      case 0:
          triPtsDefBase  = 1;
          // Tri croissant.
          ptsDefBase.text("Points de défense de base 🔼");
        break;
      case 1:
          triPtsDefBase  = 2;
          // Tri décroissant.
          ptsDefBase.text("Points de défense de base 🔽");
        break;
      case 2:
          triPtsDefBase  = 0;
          // Retour à l'état normal, sans tri.
          ptsDefBase.text("Points de défense de base");
        break;
    }
    // console.log("Tri triPtsDefBase : " + triPtsDefBase);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  ptsAtcksBase.on("click", function () {
    // Alterne le tri de l'attaque de base.
    switch (triPtsAtcksBase) {
      case 0:
          triPtsAtcksBase  = 1;
          // Tri croissant.
          ptsAtcksBase.text("Points d'attaque de base 🔼");
        break;
      case 1:
          triPtsAtcksBase  = 2;
          // Tri décroissant.
          ptsAtcksBase.text("Points d'attaque de base 🔽");
        break;
      case 2:
          triPtsAtcksBase  = 0;
          // Retour à l'état normal, sans tri.
          ptsAtcksBase.text("Points d'attaque de base");
        break;
    }
    console.log("Tri triPtsAtcksBase : " + triPtsAtcksBase);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  endurance.on("click", function () {
    // Alterne le tri de l'endurance.
    switch (triEndurance) {
      case 0:
          triEndurance  = 1;
          // Tri croissant.
          endurance.text("Endurance 🔼");
        break;
      case 1:
          triEndurance  = 2;
          // Tri décroissant.
          endurance.text("Endurance 🔽");
        break;
      case 2:
          triEndurance  = 0;
          // Retour à l'état normal, sans tri.
          endurance.text("Endurance");
        break;
    }
    console.log("Tri triEndurance : " + triEndurance);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  types.on("click", function () {
    // Alterne le tri des types.
    switch (triTypes) {
      case 0:
          triTypes  = 1;
          // Tri croissant.
          types.text("Types 🔼");
        break;
      case 1:
          triTypes  = 2;
          // Tri décroissant.
          types.text("Types 🔽");
        break;
      case 2:
          triTypes  = 0;
          // Retour à l'état normal, sans tri.
          types.text("Types");
        break;
    }
    console.log("Tri types : " + triTypes);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  generation.on("click", function () {
    // Alterne le tri de la génération.
    switch (triGeneration) {
      case 0:
          triGeneration  = 1;
          // Tri croissant.
          generation.text("Génération 🔼");
        break;
      case 1:
          triGeneration  = 2;
          // Tri décroissant.
          generation.text("Génération 🔽");
        break;
      case 2:
          triGeneration  = 0;
          // Retour à l'état normal, sans tri.
          generation.text("Génération");
        break;
    }
    console.log("Tri gen : " + triTypes);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  nom.on("click", function () {
    // Alterne le tri par nom.
    switch (triNom) {
      case 0:
          triNom  = 1;
          // Tri croissant.
          nom.text("Nom 🔼");
        break;
      case 1:
          triNom  = 2;
          // Tri décroissant.
          nom.text("Nom 🔽");
        break;
      case 2:
          triNom  = 0;
          // Retour à l'état normal, sans tri.
          nom.text("Nom");
        break;
    }
    console.log("Tri nom : " + triTypes);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
  });

  identifiant.on("click", function () {
    // Alterne le tri par identifiant.
    switch (triIdentifiant) {
      case 0:
          triIdentifiant  = 1;
          // Tri croissant.
          identifiant.text("identifiant 🔼");
        break;
      case 1:
          triIdentifiant  = 2;
          // Tri décroissant.
          identifiant.text("identifiant 🔽");
        break;
      case 2:
          triIdentifiant  = 0;
          // Retour à l'état normal, sans tri.
          identifiant.text("Identifiant");
        break;
    }
    console.log("Tri ID : " + triTypes);
    // Rafraîchit la table avec le nouveau tri.
    displayTablePage(currentPage, typeVal, attackVal, nameVal, triPtsDefBase, triPtsAtcksBase, triEndurance, triTypes, triGeneration, triNom, triIdentifiant);
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
