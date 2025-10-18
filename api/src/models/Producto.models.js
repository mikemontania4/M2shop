const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
const Categoria = require('./Categoria.models');
const Marca = require('./Marca.models');
const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  descripcionCorta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descripcionLarga: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precioComparacion: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marcaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stockMinimo: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  peso: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Peso en kg'
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  nuevo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metaTitle: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'productos',
  timestamps: true,
  underscored: true
});
 Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Producto.belongsTo(Marca, { foreignKey: 'marcaId' });
 
module.exports = Producto;
