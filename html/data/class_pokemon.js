import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";
import { pokemon_data } from "./pokemons.js";
import { pokemon_moves } from "./pokemon_moves.js";
import { pokemon_types } from "./pokemon_types.js";

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

    // On ne stocke que les formes "Normal" (voir fill_pokemons)
    Pokemon.all_pokemons[id] = this;
  }

  toString() {
    return `${this.name} : #${this.id}, [${this.types
      .map((t) => t.name)
      .join(", ")}], [STA: ${this.stats.sta}, ATK: ${this.stats.atk}, DEF: ${
      this.stats.def
    }], Rapides = [${this.attacks.fast
      .map((a) => a?.name || "Inconnu")
      .join(", ")}], Chargées = [${this.attacks.charged
      .map((a) => a?.name || "Inconnu")
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

    // Parcourir tous les pokémons
    for (let pokemon of pokemon_data) {
      // Ne garder que les formes "Normal"
      if (pokemon.form !== "Normal") continue;

      const id = pokemon.pokemon_id;

      // Éviter les doublons
      if (Pokemon.all_pokemons[id]) continue;

      // Récupérer les types depuis pokemon_types
      const typeEntry = pokemon_types.find(
        (pt) => pt.pokemon_id === id && pt.form === "Normal",
      );
      const types = typeEntry ? typeEntry.type : [];

      // Récupérer les attaques depuis pokemon_moves
      const moveEntry = pokemon_moves.find(
        (pm) => pm.pokemon_id === id && pm.form === "Normal",
      );

      // Filtrer les attaques élite
      const fastMoves = moveEntry
        ? moveEntry.fast_moves.filter(
            (m) => !(moveEntry.elite_fast_moves || []).includes(m),
          )
        : [];

      const chargedMoves = moveEntry
        ? moveEntry.charged_moves.filter(
            (m) => !(moveEntry.elite_charged_moves || []).includes(m),
          )
        : [];

      // Convertir les noms en IDs
      const fastIds = fastMoves
        .map((name) => {
          const attack = Object.values(Attack.all_attacks).find(
            (a) => a.name === name,
          );
          return attack ? attack.id : null;
        })
        .filter((id) => id !== null);

      const chargedIds = chargedMoves
        .map((name) => {
          const attack = Object.values(Attack.all_attacks).find(
            (a) => a.name === name,
          );
          return attack ? attack.id : null;
        })
        .filter((id) => id !== null);

      // Créer le Pokémon
      new Pokemon(
        id,
        pokemon.pokemon_name,
        types,
        { fast: fastIds, charged: chargedIds },
        {
          sta: pokemon.base_stamina,
          atk: pokemon.base_attack,
          def: pokemon.base_defense,
        },
      );
    }
  }

  static getPokemonsByAttack(attackName) {
    const result = [];
    const attack = Attack.getAttackByName(attackName);

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const allAttacks = pokemon.getAttacks();

      if (allAttacks.some((a) => a && a.id === attack.id)) {
        result.push(pokemon);
      }
    }

    return result;
  }

  static getPokemonsByType(typeName) {
    const result = [];

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const types = pokemon.getTypes();

      if (types.some((t) => t.name.toLowerCase() === typeName.toLowerCase())) {
        result.push(pokemon);
      }
    }

    return result;
  }

  static sortPokemonByTypeThenName() {
    const res = Object.values(
      Pokemon.all_pokemons.sort(function (a, b) {
        return a.type.localeCompare(b.type) || b.name - a.name;
      }),
    );
    console.log(res);
    return res;
  }
}
