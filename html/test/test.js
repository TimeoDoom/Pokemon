import { Type } from "../data/class_type.js";
import { Attack } from "../data/class_attack.js";

Type.fill_types();
Attack.fill_attacks();

console.log(Type.all_types["Bug"].toString());
console.log(Attack.all_attacks[345].toString());
