const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Producto = require('./Producto.models');
const VarianteProducto = sequelize.define('VarianteProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ej: Talla M - Color Rojo'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'variantes_producto',
  timestamps: true,
  underscored: true
});
 VarianteProducto.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = VarianteProducto;
