const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define('Ability', {
    name: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: 'fusion' 
    },
    description: { 
      type: DataTypes.TEXT 
    },
    mana_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: 'fusion',
      validate: {
        min: 10.0,
        max: 250.0
        }
      },
    summary: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.name} (${parseInt(
          this.mana_cost
        )} points of mana) - Description: ${this.description}`;
      },
    },
  });
};
