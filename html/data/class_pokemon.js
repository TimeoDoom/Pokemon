import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";
import { pokemon_data } from "./pokemons.js";

export class Pokemon {
  static all_pokemons = {};

  constructor(id, name, types, attacks, stats) {
    this.id = id;
    this.name = name;

    this.types = (types || []).map((t) => Type.all_types[t]);

    this.attacks = {
      fast: (attacks?.fast || []).map((id) => Attack.all_attacks[id]),
      charged: (attacks?.charged || []).map((id) => Attack.all_attacks[id]),
    };

    this.stats = {
      sta: stats.sta,
      atk: stats.atk,
      def: stats.def,
    };

    Pokemon.all_pokemons[id] = this;
  }

  toString() {
    return `${this.name} : #${this.id}, [${this.types
      .map((t) => t.name)
      .join(", ")}], [STA: ${this.stats.sta}, ATK: ${this.stats.atk}, DEF: ${
      this.stats.def
    }], Rapides = [${this.attacks.fast
      .map((a) => a.name)
      .join(", ")}], Chargées = [${this.attacks.charged
      .map((a) => a.name)
      .join(", ")}]`;
  }

  getTypes() {
    return this.types;
  }

  getAttacks() {
    return [...this.attacks.fast, ...this.attacks.charged];
  }

  static fill_pokemons() {
    Pokemon.all_pokemons = {};

    for (let pokemon of pokemon_data) {
      new Pokemon(
        pokemon["id"],
        pokemon["name"],
        pokemon["type"],
        pokemon["attacks"],
        {
          sta: pokemon["base_stamina"],
          atk: pokemon["base_attack"],
          def: pokemon["base_defense"],
        },
      );
    }
  }

  static getPokemonsByAttack(attackName) {
    const result = [];

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const allAttacks = pokemon.getAttacks();

      if (allAttacks.some((a) => a.name === attackName)) {
        result.push(pokemon);
      }
    }
    return result;
  }

  static getPokemonByType(typeName) {
    const res = Object.values(Pokemon.all_pokemons).filter((pokemon) => pokemon.types.some((t) => t.name === typeName));
    console.log(res);
    return res;
  }
}
