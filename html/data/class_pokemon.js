import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";

class Pokemon {
    static all_pokemons = {};

    constructor(id, name, types, attacks) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.attacks = attacks;
        Pokemon.all_pokemons[id] = this;
    }

    toString() {

    }

    getTypes() {

    }

    getAttacks() {
        
    }
}