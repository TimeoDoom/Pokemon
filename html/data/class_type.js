import { type_effectiveness } from "./type_effectiveness.js";

export class Type {
  static all_types = {};

  constructor(name, effectiveness) {
    this.name = name;
    this.effectiveness = effectiveness;
    Type.all_types[name] = this;
  }

  toString() {
    const grouped = {};
    for (const [type, ratio] of Object.entries(this.effectiveness)) {
      if (!grouped[ratio]) grouped[ratio] = [];
      grouped[ratio].push(type);
    }

    const sorted = Object.keys(grouped)
      .sort((a, b) => parseFloat(b) - parseFloat(a))
      .map((ratio) => `${ratio} = [${grouped[ratio].join(", ")}]`)
      .join(", ");

    return `${this.name} : ${sorted}`;
  }

  static fill_types() {
    Type.all_types = {};

    if (typeof type_effectiveness !== "object" || type_effectiveness === null) {
      return;
    }

    for (const [name, effectiveness] of Object.entries(type_effectiveness)) {
      new Type(name, effectiveness);
    }
  }
}
