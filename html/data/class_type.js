import { type_effectiveness } from "./type_effectiveness.js";

export class Type {
  static all_types = {};

  constructor(name, effectiveness) {
    this.name = name;
    this.effectiveness = effectiveness;
    Type.all_types[name] = this;
  }

  // Retourne une représentation textuelle du type.
  // Les types sont regroupés par ratio d’efficacité,
  // puis triés par ordre décroissant des ratios.
  // Format : "Nom : ratio = [types], ..."
  toString() {
    const grouped = {};
    for (const [type, ratio] of Object.entries(this.effectiveness)) {
      if (!grouped[ratio]) grouped[ratio] = [];
      grouped[ratio].push(type);
    }

    const sorted = Object.keys(grouped)
      .sort((a, b) => parseFloat(b) - parseFloat(a))
      .map(
        (ratio) =>
          `${parseFloat(ratio)
            .toFixed(3)
            .replace(/\.?0+$/, "")} = [${grouped[ratio].sort().join(", ")}]`,
      )
      .join(", ");

    return `${this.name} : ${sorted}`;
  }

  // Initialise tous les objets Type à partir de la source type_effectiveness.
  // Chaque type est instancié puis stocké dans all_types
  // sous forme d’objet indexé par nom.
  static fill_types() {
    Type.all_types = {};

    for (const [name, effectiveness] of Object.entries(type_effectiveness)) {
      new Type(name, effectiveness);
    }

    return this.all_types;
  }
}