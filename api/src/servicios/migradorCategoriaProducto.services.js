const { Op } = require('sequelize');
const Categoria = require('../models/Categoria.models');
const Producto = require('../models/Producto.models');
const VarianteProducto = require('../models/VarianteProducto.models');
const Atributo = require('../models/Atributo.models');
const ValorAtributo = require('../models/ValorAtributo.models');
const VarianteAtributo = require('../models/VarianteAtributo.models');
const Descuento = require('../models/Descuento.models');

// Inicializar relaciones
require('../models/initRelations')();

class MigradorCategoriaProductoService {
  
  /**
   * Migra productos y variantes desde el array de datos convertidos
   * @param {Array} productosArray - Array con datos de variantes_convertidos.json
   * @returns {Object} Resumen de la migración
   */
  async migrarProductosYVariante(productosArray) {
    const resumen = {
      creadas: { categorias: 0, productos: 0, variantes: 0, atributos: 0, valoresAtributos: 0, variantesAtributos: 0 },
      actualizadas: { categorias: 0, productos: 0, variantes: 0, atributos: 0, valoresAtributos: 0, variantesAtributos: 0 },
      errores: []
    };

    try {
      console.log(`Iniciando migración de ${productosArray.length} productos/variantes...`);

      for (const item of productosArray) {
        try {
          // 1. Migrar Categorías
          const { categoria, subcategoria } = await this.migrarCategorias(item, resumen);
          
          // 2. Migrar Producto
          const producto = await this.migrarProducto(item, categoria, subcategoria, resumen);
          
          // 3. Migrar VarianteProducto
          const variante = await this.migrarVarianteProducto(item, producto, resumen);
          
          // 4. Migrar Atributos Dinámicos
          await this.migrarAtributos(item, variante, resumen);

        } catch (error) {
          console.error(`Error procesando item ${item.sku}:`, error.message);
          resumen.errores.push({
            sku: item.sku,
            error: error.message
          });
        }
      }

      console.log('Migración completada:', resumen);
      return resumen;

    } catch (error) {
      console.error('Error en migración general:', error);
      throw error;
    }
  }

  /**
   * Migra descuentos desde el array de datos
   * @param {Array} descuentosArray - Array con datos de descuentos.json
   * @returns {Object} Resumen de la migración
   */
  async migrarDescuentos(descuentosArray) {
    const resumen = {
      creadas: { descuentos: 0 },
      actualizadas: { descuentos: 0 },
      errores: []
    };

    try {
      console.log(`Iniciando migración de ${descuentosArray.length} descuentos...`);

      for (const descuentoData of descuentosArray) {
        try {
          // Buscar variante por SKU
          const variante = await VarianteProducto.findOne({
            where: { sku: descuentoData.sku }
          });

          if (!variante) {
            console.warn(`Variante no encontrada para SKU: ${descuentoData.sku}`);
            resumen.errores.push({
              sku: descuentoData.sku,
              error: 'Variante no encontrada'
            });
            continue;
          }

          // Crear o actualizar descuento
          const [descuento, created] = await Descuento.findOrCreate({
            where: {
              varianteId: variante.id,
              tipo: descuentoData.tipoDescuento,
              valor: descuentoData.descuento
            },
            defaults: {
              varianteId: variante.id,
              activo: true,
              cantDesde: descuentoData.cantDesde || 1,
              cantHasta: descuentoData.cantHasta || 999999999,
              fechaDesde: new Date(), // Fecha actual como default
              fechaHasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año desde ahora
              valor: descuentoData.descuento,
              tipo: descuentoData.tipoDescuento
            }
          });

          if (created) {
            resumen.creadas.descuentos++;
          } else {
            resumen.actualizadas.descuentos++;
          }

        } catch (error) {
          console.error(`Error procesando descuento ${descuentoData.sku}:`, error.message);
          resumen.errores.push({
            sku: descuentoData.sku,
            error: error.message
          });
        }
      }

      console.log('Migración de descuentos completada:', resumen);
      return resumen;

    } catch (error) {
      console.error('Error en migración de descuentos:', error);
      throw error;
    }
  }

  /**
   * Migra categorías (principal y subcategoría)
   */
  async migrarCategorias(item, resumen) {
    // Crear/buscar categoría principal
    const [categoria, categoriaCreated] = await Categoria.findOrCreate({
      where: { slug: item.category },
      defaults: {
        nombre: this.slugToName(item.category),
        slug: item.category,
        descripcion: null,
        imagenUrl: null,
        categoriasPadreId: null,
        orden: 0,
        activo: true
      }
    });

    if (categoriaCreated) {
      resumen.creadas.categorias++;
    } else {
      resumen.actualizadas.categorias++;
    }

    // Crear/buscar subcategoría
    const [subcategoria, subcategoriaCreated] = await Categoria.findOrCreate({
      where: { 
        slug: item.subcategory,
        categoriasPadreId: categoria.id
      },
      defaults: {
        nombre: this.slugToName(item.subcategory),
        slug: item.subcategory,
        descripcion: null,
        imagenUrl: null,
        categoriasPadreId: categoria.id,
        orden: 0,
        activo: true
      }
    });

    if (subcategoriaCreated) {
      resumen.creadas.categorias++;
    } else {
      resumen.actualizadas.categorias++;
    }

    return { categoria, subcategoria };
  }

  /**
   * Migra producto
   */
  async migrarProducto(item, categoria, subcategoria, resumen) {
    const productoSlug = this.generateSlug(item.producto);
    
    const [producto, created] = await Producto.findOrCreate({
      where: { slug: productoSlug },
      defaults: {
        nombre: item.producto,
        slug: productoSlug,
        descripcionCorta: null,
        descripcionLarga: item.descripcion || null,
        usos: item.usosRecomendados || null,
        propiedades: item.propiedades || null,
        categoriaId: categoria.id,
        subcategoriaId: subcategoria.id,
        marcaId: null,
        activo: true,
        destacado: false,
        nuevo: false,
        metaTitle: null,
        metaDescription: null
      }
    });

    if (created) {
      resumen.creadas.productos++;
    } else {
      // Actualizar datos existentes
      await producto.update({
        descripcionLarga: item.descripcion || producto.descripcionLarga,
        usos: item.usosRecomendados || producto.usos,
        propiedades: item.propiedades || producto.propiedades,
        categoriaId: categoria.id,
        subcategoriaId: subcategoria.id
      });
      resumen.actualizadas.productos++;
    }

    return producto;
  }

  /**
   * Migra variante de producto
   */
  async migrarVarianteProducto(item, producto, resumen) {
    const varianteSlug = this.generateSlug(item.name);
    
    const [variante, created] = await VarianteProducto.findOrCreate({
      where: { sku: item.sku },
      defaults: {
        productoId: producto.id,
        sku: item.sku,
        nombre: item.name,
        slug: varianteSlug,
        precio: parseFloat(item.price),
        precioOriginal: parseFloat(item.originalPrice) || parseFloat(item.price),
        imagenUrl: item.image || null,
        images: item.images || null,
        stock: parseInt(item.stock) || 0,
        activo: true,
        destacado: item.featured || false,
        nuevo: false
      }
    });

    if (created) {
      resumen.creadas.variantes++;
    } else {
      // Actualizar datos existentes
      await variante.update({
        nombre: item.name,
        slug: varianteSlug,
        precio: parseFloat(item.price),
        precioOriginal: parseFloat(item.originalPrice) || parseFloat(item.price),
        imagenUrl: item.image || variante.imagenUrl,
        images: item.images || variante.images,
        stock: parseInt(item.stock) || variante.stock,
        destacado: item.featured || variante.destacado
      });
      resumen.actualizadas.variantes++;
    }

    return variante;
  }

  /**
   * Migra atributos dinámicos
   */
  async migrarAtributos(item, variante, resumen) {
    // Limpiar atributos existentes de la variante
    await VarianteAtributo.destroy({
      where: { varianteId: variante.id }
    });

    // 1. Atributo Variedad
    if (item.variedad) {
      await this.crearAtributoVariante('Variedad', 1, item.variedad, {
        color: item.color?.[0] || null
      }, variante, resumen);
    }

    // 2. Atributo Presentación
    const presentacion = item.presentacion || item.size?.[0];
    if (presentacion) {
      await this.crearAtributoVariante('Presentación', 2, presentacion, {
        imagen: item.images?.[1] || null
      }, variante, resumen);
    }

    // 3. Otros atributos dinámicos detectados
    const otrosAtributos = this.detectarOtrosAtributos(item);
    let ordenContador = 3;
    
    for (const [nombreAtributo, valor] of Object.entries(otrosAtributos)) {
      await this.crearAtributoVariante(nombreAtributo, ordenContador, valor, {}, variante, resumen);
      ordenContador++;
    }
  }

  /**
   * Crea un atributo y su valor para una variante
   */
  async crearAtributoVariante(nombreAtributo, orden, valor, propiedades, variante, resumen) {
    // Crear/buscar atributo
    const [atributo, atributoCreated] = await Atributo.findOrCreate({
      where: { nombre: nombreAtributo },
      defaults: {
        nombre: nombreAtributo,
        orden: orden,
        activo: true
      }
    });

    if (atributoCreated) {
      resumen.creadas.atributos++;
    } else {
      resumen.actualizadas.atributos++;
    }

    // Crear/buscar valor de atributo
    const [valorAtributo, valorCreated] = await ValorAtributo.findOrCreate({
      where: {
        atributoId: atributo.id,
        valor: valor
      },
      defaults: {
        atributoId: atributo.id,
        valor: valor,
        propiedades: propiedades,
        activo: true
      }
    });

    if (valorCreated) {
      resumen.creadas.valoresAtributos++;
    } else {
      resumen.actualizadas.valoresAtributos++;
    }

    // Crear relación variante-atributo
    await VarianteAtributo.create({
      varianteId: variante.id,
      valorAtributoId: valorAtributo.id,
      orden: orden
    });

    resumen.creadas.variantesAtributos++;
  }

  /**
   * Detecta otros atributos en el item (sabor, voltaje, etc.)
   */
  detectarOtrosAtributos(item) {
    const otrosAtributos = {};
    
    // Buscar campos que no sean los estándar
    const camposExcluidos = [
      'id', 'producto', 'variedad', 'presentacion', 'name', 'category', 'subcategory',
      'sku', 'image', 'images', 'price', 'originalPrice', 'size', 'featured',
      'descripcion', 'usosRecomendados', 'propiedades', 'stock', 'color'
    ];

    for (const [key, value] of Object.entries(item)) {
      if (!camposExcluidos.includes(key) && value && typeof value === 'string') {
        otrosAtributos[this.capitalizeFirst(key)] = value;
      }
    }

    return otrosAtributos;
  }

  /**
   * Utilidades
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  slugToName(slug) {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = new MigradorCategoriaProductoService();