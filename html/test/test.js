import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

function displayList(title, items) {
  console.log(`Liste des ${items.length} ${title} :`);
  items.forEach((item) => {
    console.log(`- ${item.toString()}`);
  });
}

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();


// Q1. Fonction getPokemonsByType(typeName)
function getPokemonsByType(typeName) {
  console.log(`TEST Q1: getPokemonsByType('${typeName}')`);

  const pokemons = Pokemon.getPokemonsByType(typeName);
  displayList(`Pokémons de type ${typeName}`, pokemons);

  return pokemons;
}

// Q2. Fonction getPokemonsByAttack(attackName)
function getPokemonsByAttack(attackName) {
  console.log(`TEST Q2: getPokemonsByAttack('${attackName}')`);

  const pokemons = Pokemon.getPokemonsByAttack(attackName);
  displayList(`Pokémons avec l'attaque ${attackName}`, pokemons);

  return pokemons;
}

// Q3. Fonction getAttacksByType(typeName)
function getAttacksByType(typeName) {
  console.log(`TEST Q3: getAttacksByType('${typeName}')`);

  const attacks = Object.values(Attack.all_attacks).filter(
    (attack) => attack.type.toLowerCase() === typeName.toLowerCase(),
  );

  displayList(`attaques de type ${typeName}`, attacks);

  return attacks;
}

getPokemonsByType("Grass");
console.log("\n" + "-".repeat(60) + "\n");

getPokemonsByAttack("Tackle");
console.log("\n" + "-".repeat(60) + "\n");

getAttacksByType("Water");
console.log("\n" + "-".repeat(60) + "\n");
