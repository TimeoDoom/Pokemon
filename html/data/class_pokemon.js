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
        pokemon.generation,
      );
    }
  }

  // Question 1

  static getPokemonsByType(typeName) {
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

  static getPokemonsByAttack(attackName) {
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

  static getAttacksByType(typeName) {
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

  static sortPokemonByTypeThenName() {
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

  // Question 5 methode de classe
  static getWeakestEnemies(attackName) {
    const result = [];
    const attack = Attack.getAttackByName(attackName);

    if (!attack) {
      console.log(`Aucune attaque trouvée pour '${attackName}`);
      return result;
    }

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      const allAttacks = pokemon.getAttacks();

      if (allAttacks.some((a) => a && a.id === attack.id)) {
        const types = pokemon.getTypes();
        const effectiveness = types.reduce((acc, t) => {
          const eff = Type.all_types[attack.type].effectiveness[t.name] || 1;
          return acc * eff;
        }, 1);

        result.push({ pokemon, effectiveness });
      }
    }

    console.log(`Pokemons les plus faibles contre ${attackName} :`);
    result
      .sort((a, b) => a.effectiveness - b.effectiveness)
      .slice(0, 5)
      .forEach(({ pokemon, effectiveness }) => {
        console.log(`- ${pokemon.name} (efficacité: ${effectiveness})`);
      });

    return result.slice(0, 5);
  }

  // Question 6 methode d'instance
  static getBestFastAttacksForEnemy(print, pokemonName) {
    // Trouver le Pokémon cible
    const tPokemon = Object.values(Pokemon.all_pokemons).find(
      (p) => p.name.toLowerCase() === pokemonName.toLowerCase(),
    );

    if (!tPokemon) {
      if (print) {
        console.log(`Aucun Pokémon trouvé pour '${pokemonName}'.`);
      }
      return null;
    }

    // Collecter toutes les attaques rapides uniques avec leurs dégâts
    const fastAttacksData = [];
    const fastAttacksMap = new Map();

    for (const pokemon of Object.values(Pokemon.all_pokemons)) {
      for (const attack of pokemon.attacks.fast) {
        if (attack && !fastAttacksMap.has(attack.id)) {
          fastAttacksMap.set(attack.id, attack);
        }
      }
    }

    // Pour chaque attaque rapide unique
    for (const attack of fastAttacksMap.values()) {
      // Trouver tous les Pokémons avec cette attaque
      const pokemonsWithAttack = Object.values(Pokemon.all_pokemons).filter(
        (p) => p.attacks.fast.some((a) => a && a.id === attack.id),
      );

      if (pokemonsWithAttack.length === 0) {
        continue;
      }

      // Calculer les dégâts moyens
      let totalDamage = 0;
      let totalEffectiveness = 0;

      for (const attacker of pokemonsWithAttack) {
        // Récupérer l'efficacité de l'attaque contre la cible
        const effectiveness = tPokemon.types.reduce((acc, t) => {
          const eff = Type.all_types[attack.type].effectiveness[t.name] || 1;
          return acc * eff;
        }, 1);

        // Calculer les dégâts: Puissance × Efficacité × (ATK attaquant / DEF cible)
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

    // Trier par dégâts (descending), puis par nom alphabétique
    fastAttacksData.sort((a, b) => {
      if (b.pts !== a.pts) {
        return b.pts - a.pts;
      }
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
