import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();

console.log(Type.all_types["Bug"].toString());
console.log(Attack.all_attacks[345].toString());
Pokemon.getPokemonByType("Grass");