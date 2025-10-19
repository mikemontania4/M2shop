
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Recomendable único por contexto'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagenUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  categoriasPadreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NULL si es categoría principal'
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categorias',
  timestamps: true,
  underscored: true
});

// Las relaciones se definen en initRelations.js para evitar dependencias circulares 
module.exports = Categoria;