import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();

// Question 1
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

// Question 2
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

// Question 3
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

// Question 4
function sortPokemonByTypeThenName() {
  const result = Object.values(Pokemon.all_pokemons).sort((a, b) => {
    const aTypes = a
      .getTypes()
      .map((t) => t.name.toLowerCase())
      .join(", ");
    const bTypes = b
      .getTypes()
      .map((t) => t.name.toLowerCase())
      .join(", ");

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

// Fonction getPokemonByName(pokemonName) qui va retourner l'objet d'un Pokémon par son nom
function getPokemonByName(pokemonName) {
  let result = null;

  for (let pokemon of Object.values(Pokemon.all_pokemons)) {
    if(pokemon["name"] == pokemonName) {
      result = pokemon;
    }
  }

  return result;
}

// Question 7
function fastFight(pokemonNameA, pokemonNameB) {

  let PokemonA = getPokemonByName(pokemonNameA);
  let PokemonB = getPokemonByName(pokemonNameB);

  if(PokemonA == null) {
    console.log(`${pokemonNameA} introuvable !\n`);
    return;
  }

  if(PokemonB == null) {
    console.log(`${pokemonNameB} introuvable !\n`);
    return;
  }

  const attkA = Pokemon.getBestFastAttacksForEnemy(false, pokemonNameA);
  const attkB = Pokemon.getBestFastAttacksForEnemy(false, pokemonNameB);

  let resteA = PokemonA.stats.def;
  let resteB = PokemonB.stats.def;

  const fight = []

  while(resteA > 0 || resteB > 0) {
    resteA = resteA - attkB.pts.toFixed(2);
    resteB = resteB - attkA.pts.toFixed(2);
    fight.push(
      {Attaquant: `${pokemonNameA}`, ATK: `${PokemonA.stats.atk}`, Défenseur: `${pokemonNameB}`, DEF: `${PokemonA.stats.def}`, Nom_Attaque: `${attkB.name}`, Efficacité: `${attkB.eff.toFixed(2)}`, Dégâts: `${attkB.pts.toFixed(2)}`, Reste: `${resteA > 0 ? resteA : 0}` }
    )
    if(resteA > 0) {
      fight.push(
        {Attaquant: `${pokemonNameB}`, ATK: `${PokemonB.stats.atk}`, Défenseur: `${pokemonNameA}`, DEF: `${PokemonB.stats.def}`, Nom_Attaque: `${attkA.name}`, Efficacité: `${attkA.eff.toFixed(2)}`, Dégâts: `${attkA.pts.toFixed(2)}`, Reste: `${resteB > 0 ? resteB : 0}` }
      )
    }
  }

  return fight;
}

console.table(fastFight("Bulbasaur", "Charizard"));

// Q1. Fonction getPokemonsByType(typeName)
console.log(getPokemonsByType("Grass"));
console.log("\n" + "-".repeat(60) + "\n");

// Q2. Fonction getPokemonsByAttack(attackName)
console.log(getPokemonsByAttack("Tackle"));
console.log("\n" + "-".repeat(60) + "\n");

// Q3. Fonction getAttacksByType(typeName)
console.log(getAttacksByType("Fire"));
console.log("\n" + "-".repeat(60) + "\n");

// Q4. Fonction sortPokemonByTypeThenName()
console.log(sortPokemonByTypeThenName());

// Q5. Fonction getWeakestEnemies(attackName)
Pokemon.getWeakestEnemies("Vine Whip");

// Q6. Fonction getBestFastAttacksForEnemy(print, pokemonName)
let print = true;
Pokemon.getBestFastAttacksForEnemy(print, "Bulbasaur");

// Q7. Fonction fastFight(pokemonNameA, pokemonNameB)
