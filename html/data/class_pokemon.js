import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";

export class Pokemon {
  static all_pokemons = {};

  constructor(id, name, types, attacks) {
    this.id = id;
    this.name = name;
    this.types = types;
    this.attacks = attacks;
    Pokemon.all_pokemons[id] = this;
  }

  toString() {
    return `${this.name} : #${this.id}, [${this.types.map((t) => t.name).join(", ")}], [STA: ${this.stats.sta}, ATK: ${this.stats.atk}, DEF: ${this.stats.def}], Rapides = [${this.attacks.fast.map((a) => a.name).join(", ")}], Chargées = [${this.attacks.charged.map((a) => a.name).join(", ")}]`;
  }

  getTypes() {
    let types = [];

    for (let type of this.types) {
      types.push(Type.all_types[type]);
    }

    return types;
  }

  getAttacks() {
    let attacks = [];

<<<<<<< HEAD
    getAttacks() {
      
=======
    for (let move of this.attacks.fast) {
      attacks.push(Attack.all_attacks[move]);
>>>>>>> 270c080 (Refactor getTypes and getAttacks methods for improved clarity and consistency)
    }

    for (let move of this.attacks.charged) {
      attacks.push(Attack.all_attacks[move]);
    }

    return attacks;
  }

  static fill_pokemons(pokemon_data) {
    for (let pokemon of pokemon_data) {
      new Pokemon(
        pokemon["id"],
        pokemon["name"],
        pokemon["type"],
        pokemon["attacks"],
      );
    }
  }
}
