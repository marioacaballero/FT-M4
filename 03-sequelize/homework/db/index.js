const { Sequelize, Op } = require("sequelize");
const modelCharacter = require("./models/Character.js");
const modelAbility = require("./models/Ability.js");
const modelRole = require("./models/Role.js");

// const { DB_PASSWORD } = process.env;

const db = new Sequelize(
  `postgres://postgres:12345@localhost:5432/henry_sequelize`,
  {
    logging: false,
  }
);

// Estas funciones crean el db.models
modelCharacter(db);
modelAbility(db);
modelRole(db);

// Por lo tanto el destructuring va luego de que se inyectan los modelos.

const { Character, Ability, Role } = db.models;

Character.hasMany(Ability);
Ability.belongsTo(Character);

Character.belongsToMany(Role, { through: "Character_Role" });
Role.belongsToMany(Character, { through: "Character_Role" });

module.exports = {
  ...db.models,
  db,
  Op,
};
