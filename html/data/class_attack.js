import "pokemon_moves.js";
import "fast_moves.js";
import "charged_moves.js";

class Attack {

    static all_attacks = [];

    constructor(id, name, type, power, delay) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.power = power;
        this.delay = delay;
    }

    toString() {
        return (this.name + " : #" + this.id + ", " + this.type + ", " + this.power + ", " + this.delay + "ms");
    }

    fill_attacks() {
        attk = new Attack();
        for (let attack of fast_moves) {
            attk = Attack(attack["move_id"], attack["name"], attack["type"], attack["power"], attack["duration"]);
            this.all_attacks[attack["move_id"]] = attk;
        }
    }
}