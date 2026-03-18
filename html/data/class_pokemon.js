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
  }

  // Fonction getAttacks() renvoyant la liste des objets Attack (cf. class_attack.js) attribués à un Pokémon

  getAttacks() {

  }

  // Fonction getPokemonsByType() affichant la liste des objets Pokemon (cf. class_pokemon.js) possédant ce type

  getPokemonsByType(typeName) {
    tabType = fill_types();
    tabType.filter((type) => type == typeName);
  }
}