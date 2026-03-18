// Importation des données requises

import { pokemon_moves } from "./pokemon_moves.js";
import { fast_moves } from "./fast_moves.js";
import { charged_moves } from "./charged_moves.js";

// Création de la classe Attacks repertoriant toutes les attaques des Pokémons

export class Attack {

    // Objet qui va stocker la totalité des attaques sous formes d'objet indexés sur l'id de l'attaque

    static all_attacks = {};

    // Constructeur de chaque attaque

    constructor(id, name, type, power, delay) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.power = power;
        this.delay = delay;
    }

    // Fonction toString() permettant de retourner une chaine de charactère contenant les informations relatives à une attaque

    toString() {
        return (this.name + " : #" + this.id + ", " + this.type + ", " + this.power + ", " + this.delay + "ms");
    }

    // Fonction fill_attacks() permettant de remplir le tableau de donnée all_attacks[] en récupérant
    // les données dans les différents fichiers importés au débuts

    static fill_attacks() {
        let attk = new Attack();

        // Récupération des attaques dans fast_moves.js

        for (let attack of fast_moves) {
            attk = new Attack(attack["move_id"], attack["name"], attack["type"], attack["power"], attack["duration"]);
            this.all_attacks[attack["move_id"]] = attk;
        }

        // Récupération des attaques dans charges_moves.js
        for (let attack of charged_moves) {
            attk = new Attack(attack["move_id"], attack["name"], attack["type"], attack["power"], attack["duration"]);
            this.all_attacks[attack["move_id"]] = attk;
        }

        return this.all_attacks;
    }
}