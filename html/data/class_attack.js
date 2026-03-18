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

  static all_attacks = {};

  static fill_attacks() {
    this.all_attacks = {};

    let attk;

    // fast
    for (let attack of fast_moves) {
      attk = new Attack(
        attack["move_id"],
        attack["name"],
        attack["type"],
        attack["power"],
        attack["duration"],
      );
      this.all_attacks[attack["move_id"]] = attk;
    }

    // charged
    for (let attack of charged_moves) {
      attk = new Attack(
        attack["move_id"],
        attack["name"],
        attack["type"],
        attack["power"],
        attack["duration"],
      );
      this.all_attacks[attack["move_id"]] = attk;
    }

    for (let attack of pokemon_moves) {
      attk = new Attack(
        attack["move_id"],
        attack["name"],
        attack["type"],
        attack["power"],
        attack["duration"],
      );
      this.all_attacks[attack["move_id"]] = attk;
    }
  }
}
