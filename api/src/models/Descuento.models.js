const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const VarianteProducto = require('./VarianteProducto.models');

const Descuento = sequelize.define('Descuento', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  varianteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'FK a variantes_producto (nullable si aplica a grupos)'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  cantDesde: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true,
    defaultValue: 1
  },
  cantHasta: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true,
    defaultValue: 999999999
  },
  fechaDesde: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaHasta: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'IMPORTE, PRODUCTO, u otros'
  }
}, {
  tableName: 'descuentos',
  timestamps: false,
  underscored: true
});

// Las relaciones se definen en initRelations.js para evitar dependencias circulares

module.exports = Descuento;
