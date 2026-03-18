import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";
import { Pokemon } from "../data/class_pokemon.js";

Type.fill_types();
Attack.fill_attacks();
Pokemon.fill_pokemons();

// Q1. Fonction getPokemonsByType(typeName)
Pokemon.getPokemonsByType("Grass");

// Q2. Fonction getPokemonsByAttack(attackName)
Pokemon.getPokemonsByAttack("Tackle");

// Q3. Fonction getAttacksByType(typeName)
Pokemon.getAttacksByType("Fire");

// Q5. Fonction getWeakestEnemies(attackName)
Pokemon.getWeakestEnemies("Vine Whip");

// 
