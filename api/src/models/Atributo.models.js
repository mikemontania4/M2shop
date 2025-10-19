const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');

const Atributo = sequelize.define('Atributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ej: Variedad, Presentación, Sabor, Color'
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Orden de concatenación en el nombre de la variante'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'atributos',
  timestamps: true,
  underscored: true
});

module.exports = Atributo;