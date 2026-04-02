import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";
import { pokemon_data } from "./pokemons.js";
import { pokemon_moves } from "./pokemon_moves.js";
import { pokemon_types } from "./pokemon_types.js";

export class Pokemon {
  static all_pokemons = {};

  constructor(id, name, types, attacks, stats, generation) {
    this.id = id;
    this.name = name;
    this.generation = generation;

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

  static calculateGeneration(pokemonId) {
    if (pokemonId <= 151) return 1;
    if (pokemonId <= 251) return 2;
    if (pokemonId <= 386) return 3;
    if (pokemonId <= 493) return 4;
    if (pokemonId <= 649) return 5;
    if (pokemonId <= 721) return 6;
    if (pokemonId <= 809) return 7;
    if (pokemonId <= 905) return 8;
    return 9;
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

    for (let pokemon of pokemon_data) {
      if (pokemon.form !== "Normal") continue;

      const id = pokemon.pokemon_id;
      if (Pokemon.all_pokemons[id]) continue;

      const typeEntry = pokemon_types.find(
        (pt) => pt.pokemon_id === id && pt.form === "Normal",
      );
      const types = typeEntry ? typeEntry.type : [];

      const moveEntry = pokemon_moves.find(
        (pm) => pm.pokemon_id === id && pm.form === "Normal",
      );

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

      const generation = this.calculateGeneration(id);

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
        generation,
      );
    }
  }

  // ─── Q5. getWeakestEnemies(attackName) ──────────────────────────────────
  static getWeakestEnemies(attackName) {
    const result = [];
    const attack = Attack.getAttackByName(attackName);

    if (!attack) {
      console.log(`Aucune attaque trouvée pour '${attackName}'`);
      return result;
    }

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const types = pokemon.getTypes();
      const effectiveness = types.reduce((acc, t) => {
        const eff = Type.all_types[attack.type]?.effectiveness[t.name] || 1;
        return acc * eff;
      }, 1);

      result.push({ pokemon, effectiveness });
    }

    const sorted = result
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5);

    console.log(`Pokémons les plus faibles contre ${attackName} :`);
    sorted.forEach(({ pokemon, effectiveness }) => {
      console.log(`- ${pokemon.toString()} (efficacité: ${effectiveness})`);
    });

    return sorted;
  }

  // ─── Q6. getBestFastAttacksForEnemy(print, pokemonName) ─────────────────
  static getBestFastAttacksForEnemy(print, pokemonName) {
    const tPokemon = Object.values(Pokemon.all_pokemons).find(
      (p) => p.name.toLowerCase() === pokemonName.toLowerCase(),
    );

    if (!tPokemon) {
      if (print) console.log(`Aucun Pokémon trouvé pour '${pokemonName}'.`);
      return null;
    }

    const fastAttacksData = [];
    const fastAttacksMap = new Map();

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      for (const attack of pokemon.attacks.fast) {
        if (attack && !fastAttacksMap.has(attack.id)) {
          fastAttacksMap.set(attack.id, attack);
        }
      }
    }

    for (const attack of fastAttacksMap.values()) {
      const pokemonsWithAttack = Object.values(Pokemon.all_pokemons).filter(
        (p) => p.attacks.fast.some((a) => a && a.id === attack.id),
      );

      if (pokemonsWithAttack.length === 0) continue;

      let totalDamage = 0;
      let totalEffectiveness = 0;

      for (const attacker of pokemonsWithAttack) {
        const effectiveness = tPokemon.types.reduce((acc, t) => {
          const eff = Type.all_types[attack.type]?.effectiveness[t.name] || 1;
          return acc * eff;
        }, 1);

        const damage =
          attack.power *
          effectiveness *
          (attacker.stats.atk / tPokemon.stats.def);
        totalDamage += damage;
        totalEffectiveness += effectiveness;
      }

      const averageDamage = totalDamage / pokemonsWithAttack.length;
      const averageEffectiveness =
        totalEffectiveness / pokemonsWithAttack.length;

      fastAttacksData.push({
        name: attack.name,
        atk: attack,
        pts: averageDamage,
        eff: averageEffectiveness,
      });
    }

    // Tri par dégâts décroissants, puis par nom alphabétique en cas d'égalité
    fastAttacksData.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return a.atk.name.localeCompare(b.atk.name);
    });

    const best = fastAttacksData[0];

    if (print && best) {
      console.log(
        `\nMeilleure attaque rapide contre ${tPokemon.name} (DEF: ${tPokemon.stats.def}):`,
      );
      console.log(`- ${best.atk.toString()}`);
      console.log(
        `  Dégâts: ${best.pts.toFixed(2)}, Efficacité: ${best.eff.toFixed(2)}`,
      );
    }

    return best || null;
  }
}
