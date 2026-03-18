import { pokemon_moves } from "./pokemon_moves.js";
import { fast_moves } from "./fast_moves.js";
import { charged_moves } from "./charged_moves.js";

export class Attack {
  // Index de toutes les attaques, accessible par move_id.
  static all_attacks = {};

  constructor(id, name, type, power, duration) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.power = power;
    this.duration = duration;
  }

  toString() {
    return `${this.name} : #${this.id}, ${this.type}, ${this.power}, ${this.duration}ms`;
  }

  static fill_attacks() {
    // Réinitialise le cache avant de le reconstruire.
    Attack.all_attacks = {};

    // Regroupe toutes les sources d'attaques dans une seule collection.
    const all = [...fast_moves, ...charged_moves, ...pokemon_moves];

    for (let attack of all) {
      const attk = new Attack(
        attack["move_id"],
        attack["name"],
        attack["type"],
        attack["power"],
        attack["duration"],
      );

      // Stocke l'attaque par son identifiant pour un accès direct.
      Attack.all_attacks[attack["move_id"]] = attk;
    }
  }
}
