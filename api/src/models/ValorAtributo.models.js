const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Atributo = require('./Atributo.models');

const ValorAtributo = sequelize.define('ValorAtributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  atributoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Ej: Extra, Bolsa de 10Kg, Rojo'
  },
  propiedades: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Ej: { "color":"#eb961e", "imagen":"https://..." }'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'valores_atributos',
  timestamps: true,
  underscored: true
});

// Las relaciones se definen en initRelations.js para evitar dependencias circulares

module.exports = ValorAtributo;