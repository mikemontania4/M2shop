// Definir todas las relaciones
const setupAssociations = () => {
  // Importar modelos después de que estén definidos
  const Producto = require('./Producto.models');
  const Categoria = require('./Categoria.models');
  const Marca = require('./Marca.models');
  const Descuento = require('./Descuento.models');
  const ImagenProducto = require('./ImagenProducto.models');
  const VarianteProducto = require('./VarianteProducto.models');
  const AtributoProducto = require('./AtributoProducto.models');

  // Relaciones de Producto
  Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
  Producto.belongsTo(Marca, { foreignKey: 'marcaId' });
  Producto.hasMany(Descuento, { foreignKey: 'productoId', as: 'descuentos' });
  Producto.hasMany(ImagenProducto, { foreignKey: 'productoId' });
  Producto.hasMany(VarianteProducto, { foreignKey: 'productoId' });
  Producto.hasMany(AtributoProducto, { foreignKey: 'productoId' });

  // Relaciones de Categoria
  Categoria.belongsTo(Categoria, { as: 'CategoriaPadre', foreignKey: 'categoriasPadreId' });
  Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });

  // Relaciones de Descuento
  Descuento.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

  // Relaciones de ImagenProducto
  ImagenProducto.belongsTo(Producto, { foreignKey: 'productoId' });

  // Relaciones de VarianteProducto
  VarianteProducto.belongsTo(Producto, { foreignKey: 'productoId' });

  // Relaciones de AtributoProducto
  AtributoProducto.belongsTo(Producto, { foreignKey: 'productoId' });
};

module.exports = { setupAssociations };