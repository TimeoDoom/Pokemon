import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();

function getPokemonsByType(typeName) {
    const result = [];

    if (!typeName) {
      console.log("Aucun type fourni.");
      return result;
    }

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const types = pokemon.getTypes();

      if (
        types.some((t) => t && t.name.toLowerCase() === typeName.toLowerCase())
      ) {
        result.push(pokemon);
      }
    }

    console.log(`Pokemons de type ${typeName} (${result.length}) :`);
    result.forEach((pokemon) => {
      console.log(`- ${pokemon.name}`);
    });

    return result;
  }

function getPokemonsByAttack(attackName) {
    const result = [];
    const attack = Attack.getAttackByName(attackName);

    if (!attack) {
      console.log(`Aucune attaque trouvée pour '${attackName}'.`);
      return result;
    }

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const allAttacks = pokemon.getAttacks();

      if (allAttacks.some((a) => a && a.id === attack.id)) {
        result.push(pokemon);
      }
    }

    console.log(`Pokemons avec l'attaque ${attackName} (${result.length}) :`);
    result.forEach((pokemon) => {
      console.log(`- ${pokemon.name}`);
    });

    return result;
  }

function getAttacksByType(typeName) {
    const result = [];
    const type = Type.all_types[typeName];

    if (!type) {
      console.log(`Aucun type trouvé pour '${typeName}'.`);
      return result;
    }

    for (const attack of Object.values(Attack.all_attacks)) {
      if (attack.type === type.name) {
        result.push(attack);
      }
    }

    console.log(`Attaques de type ${typeName} (${result.lenght})`);
    result.forEach((attack) => {
      console.log(`- ${attack.name}`);
    });
  }

function sortPokemonByTypeThenName() {
    const result = Object.values(Pokemon.all_pokemons).sort((a, b) => {
      const aTypes = a.getTypes().map((t) => t.name.toLowerCase()).join(", ");
      const bTypes = b.getTypes().map((t) => t.name.toLowerCase()).join(", ");

      if (aTypes < bTypes) return -1;
      if (aTypes > bTypes) return 1;

      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
    return result;
}


// Q1. Fonction getPokemonsByType(typeName)
console.log(getPokemonsByType("Grass"));

// Q2. Fonction getPokemonsByAttack(attackName)
getPokemonsByAttack("Tackle");

// Q3. Fonction getAttacksByType(typeName)
getAttacksByType("Fire");

// Q5. Fonction getWeakestEnemies(attackName)
Pokemon.getWeakestEnemies("Vine Whip");

// Q6. Fonction getBestFastAttacksForEnemy(print, pokemonName)
let print = true;
Pokemon.getBestFastAttacksForEnemy(print, "Bulbasaur");
displayList(`attaques de type ${typeName}`, attacks);

Pokemon.getPokemonsByType("Grass");
console.log("\n" + "-".repeat(60) + "\n");

Pokemon.getPokemonsByAttack("Tackle");
console.log("\n" + "-".repeat(60) + "\n");

Pokemon.getAttacksByType("Water");
console.log("\n" + "-".repeat(60) + "\n");

console.log(sortPokemonByTypeThenName());
