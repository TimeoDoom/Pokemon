import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();

// Q1. getPokemonsByType(typeName)
function getPokemonsByType(typeName) {
  const result = [];

  if (!typeName) {
    console.log("Aucun type fourni.");
    return result;
  }

  for (const pokemon of Object.values(Pokemon.all_pokemons)) {
    const types = pokemon.getTypes();
    if (types.some((t) => t && t.name.toLowerCase() === typeName.toLowerCase())) {
      result.push(pokemon);
    }
  }

  console.log(`Liste des ${result.length} Pokémons :`);
  result.forEach((pokemon) => {
    console.log(`- ${pokemon.toString()}`);
  });

  return result;
}

// Q2. getPokemonsByAttack(attackName) 
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

  console.log(`Liste des ${result.length} Pokémons :`);
  result.forEach((pokemon) => {
    console.log(`- ${pokemon.toString()}`);
  });

  return result;
}

// Q3. getAttacksByType(typeName)
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

  console.log(`Liste des ${result.length} attaques :`);
  result.forEach((attack) => {
    console.log(`- ${attack.toString()}`);
  });

  return result;
}

// Q4. sortPokemonsByTypeThenName()
function sortPokemonsByTypeThenName() {
  const result = Object.values(Pokemon.all_pokemons).sort((a, b) => {
    const aTypes = a.getTypes()
      .map((t) => t.name.toLowerCase())
      .sort()
      .join(", ");
    const bTypes = b.getTypes()
      .map((t) => t.name.toLowerCase())
      .sort()
      .join(", ");

    if (aTypes < bTypes) return -1;
    if (aTypes > bTypes) return 1;

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return 0;
  });

  console.log(`Liste des ${result.length} Pokémons :`);
  result.forEach((pokemon) => {
    console.log(`- ${pokemon.toString()}`);
  });

  return result;
}

// Utilitaire : getPokemonByName(pokemonName)
function getPokemonByName(pokemonName) {
  for (const pokemon of Object.values(Pokemon.all_pokemons)) {
    if (pokemon.name.toLowerCase() === pokemonName.toLowerCase()) {
      return pokemon;
    }
  }
  return null;
}

// Q7. fastFight(pokemonNameA, pokemonNameB)
function fastFight(pokemonNameA, pokemonNameB) {
  const pokemonA = getPokemonByName(pokemonNameA);
  const pokemonB = getPokemonByName(pokemonNameB);

  if (!pokemonA) {
    console.log(`${pokemonNameA} introuvable !`);
    return;
  }
  if (!pokemonB) {
    console.log(`${pokemonNameB} introuvable !`);
    return;
  }

  const attkA = Pokemon.getBestFastAttacksForEnemy(false, pokemonNameB); // meilleure attaque de A contre B
  const attkB = Pokemon.getBestFastAttacksForEnemy(false, pokemonNameA); // meilleure attaque de B contre A

  if (!attkA || !attkB) {
    console.log("Impossible de trouver les attaques pour le combat.");
    return;
  }

  // On travaille sur (STA), pas la défense
  let staA = pokemonA.stats.sta;
  let staB = pokemonB.stats.sta;

  // Les dégâts sont des nombres (pas des strings)
  const dmgA = parseFloat(attkA.pts.toFixed(2)); // dégâts de A sur B
  const dmgB = parseFloat(attkB.pts.toFixed(2)); // dégâts de B sur A

  const fight = [];
  let tour = 1;

  while (staA > 0 && staB > 0) {
    // A attaque B
    staB = Math.max(0, parseFloat((staB - dmgA).toFixed(2)));
    fight.push({
      Tour: tour,
      Attaquant: pokemonNameA,
      ATK: pokemonA.stats.atk,
      Défenseur: pokemonNameB,
      DEF: pokemonB.stats.def,
      "Nom Attaque": attkA.name,
      Efficacité: attkA.eff.toFixed(2),
      Dégâts: dmgA.toFixed(2),
      Reste: staB,
    });

    if (staB <= 0) break;
    tour++;

    // B attaque A
    staA = Math.max(0, parseFloat((staA - dmgB).toFixed(2)));
    fight.push({
      Tour: tour,
      Attaquant: pokemonNameB,
      ATK: pokemonB.stats.atk,
      Défenseur: pokemonNameA,
      DEF: pokemonA.stats.def,
      "Nom Attaque": attkB.name,
      Efficacité: attkB.eff.toFixed(2),
      Dégâts: dmgB.toFixed(2),
      Reste: staA,
    });

    tour++;
  }

  console.table(fight);
  return fight;
}


// ════════════════════════════════════════════════════════════════════════════
//  APPELS DE TEST
// ════════════════════════════════════════════════════════════════════════════

console.log("═".repeat(60));
console.log("Q1. getPokemonsByType('Grass')");
console.log("═".repeat(60));
getPokemonsByType("Grass");

console.log("\n" + "═".repeat(60));
console.log("Q2. getPokemonsByAttack('Tackle')");
console.log("═".repeat(60));
getPokemonsByAttack("Tackle");

console.log("\n" + "═".repeat(60));
console.log("Q3. getAttacksByType('Fire')");
console.log("═".repeat(60));
getAttacksByType("Fire");

console.log("\n" + "═".repeat(60));
console.log("Q4. sortPokemonsByTypeThenName()");
console.log("═".repeat(60));
sortPokemonsByTypeThenName();

console.log("\n" + "═".repeat(60));
console.log("Q5. getWeakestEnemies('Vine Whip')");
console.log("═".repeat(60));
Pokemon.getWeakestEnemies("Vine Whip");

console.log("\n" + "═".repeat(60));
console.log("Q6. getBestFastAttacksForEnemy(true, 'Bulbasaur')");
console.log("═".repeat(60));
Pokemon.getBestFastAttacksForEnemy(true, "Bulbasaur");

console.log("\n" + "═".repeat(60));
console.log("Q7. fastFight('Bulbasaur', 'Charizard')");
console.log("═".repeat(60));
fastFight("Bulbasaur", "Charizard");

// Export des fonctions
export {
  getPokemonsByType,
  getPokemonsByAttack,
  getAttacksByType,
  sortPokemonsByTypeThenName,
  getPokemonByName,
  fastFight,
};
