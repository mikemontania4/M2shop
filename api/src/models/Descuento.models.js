const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 

const moment = require('moment'); 
const Descuento = sequelize.define('Descuento', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
 
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID del producto al que aplica el descuento'
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'SKU del producto al que aplica el descuento'
  },
  activo: {
    type: DataTypes.BOOLEAN,
  defaultValue:true,
    allowNull: false
  },
  cantDesde: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true,
    defaultValue:1
  },
  cantHasta: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true,
    defaultValue:999999999
  },
  
  fechaDesde: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaDesde')).format('YYYY-MM-DD');
    }
  },
  fechaHasta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return moment(this.getDataValue('fechaHasta')).format('YYYY-MM-DD');
    }
  },
  valor: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false,
    comment: 'Valor del descuento (porcentaje o monto fijo)'
  },
 
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'PORCENTAJE, IMPORTE'
  },
  
 
}, {
  tableName: 'descuentos',
  timestamps: false,
  underscored: true, // Convierte automáticamente a snake_case
});
 
module.exports = Descuento;
