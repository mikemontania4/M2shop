const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const VarianteProducto = require('./VarianteProducto.models');
const ValorAtributo = require('./ValorAtributo.models');

const VarianteAtributo = sequelize.define('VarianteAtributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  varianteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorAtributoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Permite concatenar atributos en orden específico'
  }
}, {
  tableName: 'variantes_atributos',
  timestamps: true,
  underscored: true
});

// Las relaciones se definen en initRelations.js para evitar dependencias circulares

module.exports = VarianteAtributo;