// Importation des données requises

import { pokemon_moves } from "./pokemon_moves.js";
import { fast_moves } from "./fast_moves.js";
import { charged_moves } from "./charged_moves.js";

// Création de la classe Attacks repertoriant toutes les attaques des Pokémons

export class Attack {

  // Index de toutes les attaques, accessible par move_id.
  // Objet qui va stocker la totalité des attaques sous formes d'objet indexés sur l'id de l'attaque

  static all_attacks = {};

  // Constructeur de chaque attaque

  constructor(id, name, type, power, duration) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.power = power;
    this.duration = duration;
  }

  // Fonction toString() permettant de retourner une chaine de charactère contenant les informations relatives à une attaque

  toString() {
    return `${this.name} : #${this.id}, ${this.type}, ${this.power}, ${this.duration}ms`;
  }

  // Fonction fill_attacks() permettant de remplir le tableau de donnée all_attacks[] en récupérant
  // les données dans les différents fichiers importés au débuts

  static all_attacks = {};

  static fill_attacks() {
    this.all_attacks = {};

    // Récupération des attaques dans fast_moves.js, charged_moves.js et pokemon_moves.js

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

    return this.all_attacks;
  }
}
