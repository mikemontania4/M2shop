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
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Se puede generar concatenando atributos'
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precioOriginal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Precio sin descuentos'
  },
  imagenUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de URLs de imágenes'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  nuevo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'variantes_producto',
  timestamps: true,
  underscored: true
});
// Las relaciones se definen en initRelations.js para evitar dependencias circulares

module.exports = VarianteProducto;
