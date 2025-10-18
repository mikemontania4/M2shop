const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Producto = require('./Producto.models');
const AtributoProducto = sequelize.define('AtributoProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ej: Color, Talla, Material'
  },
  valor: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'atributos_producto',
  timestamps: true,
  underscored: true
});
 AtributoProducto.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = AtributoProducto;
