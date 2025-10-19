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
  usos: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de usos recomendados'
  },
  propiedades: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de propiedades del producto'
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subcategoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'FK a categorias (padre = categoriaId)'
  },
  marcaId: {
    type: DataTypes.INTEGER,
    allowNull: true
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
// Las relaciones se definen en initRelations.js para evitar dependencias circulares
 
module.exports = Producto;
