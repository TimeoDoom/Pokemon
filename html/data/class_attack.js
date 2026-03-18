// Importation des données requises
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

  // Fonction toString() permettant de retourner une chaine de caractère contenant les informations relatives à une attaque
  toString() {
    return `${this.name} : #${this.id}, ${this.type}, ${this.power}, ${this.duration}ms`;
  }

  // Fonction fill_attacks() permettant de remplir le tableau de donnée all_attacks[] en récupérant
  // les données dans les différents fichiers importés au débuts
  static fill_attacks() {
    this.all_attacks = {};

    let attack;

    // fast moves
    for (let move of fast_moves) {
      attack = new Attack(
        move["move_id"],
        move["name"],
        move["type"],
        move["power"],
        move["duration"],
      );
      this.all_attacks[move["move_id"]] = attack;
    }

    // charged moves
    for (let move of charged_moves) {
      attack = new Attack(
        move["move_id"],
        move["name"],
        move["type"],
        move["power"],
        move["duration"],
      );
      this.all_attacks[move["move_id"]] = attack;
    }

    return this.all_attacks;
  }

  // Méthode pour récupérer une attaque par son nom
  static getAttackByName(attackName) {
    const attacks = Object.values(this.all_attacks);
    return attacks.find(a => a.name.toLowerCase() === attackName.toLowerCase());
  }
}