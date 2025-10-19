const Producto = require('./Producto.models');
const VarianteProducto = require('./VarianteProducto.models');
const Categoria = require('./Categoria.models');
const Marca = require('./Marca.models');
const Atributo = require('./Atributo.models');
const ValorAtributo = require('./ValorAtributo.models');
const VarianteAtributo = require('./VarianteAtributo.models');
const Descuento = require('./Descuento.models');

// Variable para controlar si las relaciones ya fueron inicializadas
let relationsInitialized = false;

// Configurar todas las relaciones
const initRelations = () => {
  if (relationsInitialized) {
    return;
  }

  // Relaciones de Producto
  Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
  Producto.belongsTo(Categoria, { foreignKey: 'subcategoriaId', as: 'subcategoria' });
  Producto.belongsTo(Marca, { foreignKey: 'marcaId', as: 'marca' });
  Producto.hasMany(VarianteProducto, { foreignKey: 'productoId', as: 'variantes' });

  // Relaciones de VarianteProducto
  VarianteProducto.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
  VarianteProducto.belongsToMany(ValorAtributo, { 
    through: VarianteAtributo, 
    foreignKey: 'varianteId',
    otherKey: 'valorAtributoId',
    as: 'atributos' 
  });
  VarianteProducto.hasMany(Descuento, { foreignKey: 'varianteId', as: 'descuentos' });

  // Relaciones de Categoria (jerárquicas)
  Categoria.belongsTo(Categoria, { as: 'CategoriaPadre', foreignKey: 'categoriasPadreId' });
  Categoria.hasMany(Categoria, { as: 'Subcategorias', foreignKey: 'categoriasPadreId' });

  // Relaciones de Atributo y ValorAtributo
  Atributo.hasMany(ValorAtributo, { foreignKey: 'atributoId', as: 'valores' });
  ValorAtributo.belongsTo(Atributo, { foreignKey: 'atributoId', as: 'atributo' });

  // Relaciones de VarianteAtributo (tabla pivot)
  VarianteAtributo.belongsTo(VarianteProducto, { foreignKey: 'varianteId', as: 'variante' });
  VarianteAtributo.belongsTo(ValorAtributo, { foreignKey: 'valorAtributoId', as: 'valorAtributo' });

  // Relaciones de Descuento
  Descuento.belongsTo(VarianteProducto, { foreignKey: 'varianteId', as: 'variante' });

  relationsInitialized = true;
  console.log('✅ Relaciones de modelos inicializadas');
};

module.exports = initRelations;