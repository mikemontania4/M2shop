const { Op } = require('sequelize');
const VarianteProducto = require('../models/VarianteProducto.models');
const Producto = require('../models/Producto.models');
const Categoria = require('../models/Categoria.models');
const Atributo = require('../models/Atributo.models');
const ValorAtributo = require('../models/ValorAtributo.models');
const VarianteAtributo = require('../models/VarianteAtributo.models');
const Descuento = require('../models/Descuento.models');

// Inicializar relaciones
require('../models/initRelations')();

/**
 * Obtiene una variante por SKU con producto embebido y atributos
 */
const getVarianteBySku = async (req, res) => {
  try {
    const { sku } = req.params;

    const variante = await VarianteProducto.findOne({
      where: { sku },
      include: [
        {
          model: Producto,
          as: 'producto',
          include: [
            {
              model: Categoria,
              as: 'categoria',
              attributes: ['id', 'nombre', 'slug']
            },
            {
              model: Categoria,
              as: 'subcategoria',
              attributes: ['id', 'nombre', 'slug']
            }
          ]
        },
        {
          model: ValorAtributo,
          as: 'atributos',
          through: {
            model: VarianteAtributo,
            attributes: ['orden']
          },
          include: [
            {
              model: Atributo,
              as: 'atributo',
              attributes: ['nombre']
            }
          ],
          order: [[{ model: VarianteAtributo, as: 'VarianteAtributo' }, 'orden', 'ASC']]
        }
      ]
    });

    if (!variante) {
      return res.status(404).json({
        success: false,
        message: 'Variante no encontrada'
      });
    }

    // Calcular precio con descuentos activos
    const descuentosActivos = await Descuento.findAll({
      where: {
        varianteId: variante.id,
        activo: true,
        fechaDesde: { [Op.lte]: new Date() },
        fechaHasta: { [Op.gte]: new Date() }
      }
    });

    let precioFinal = variante.precio;
    let precioOriginal = variante.precioOriginal || variante.precio;

    // Aplicar descuentos (lógica simple - tomar el mayor descuento)
    if (descuentosActivos.length > 0) {
      const mayorDescuento = descuentosActivos.reduce((max, descuento) => {
        return descuento.valor > max.valor ? descuento : max;
      });

      if (mayorDescuento.tipo === 'IMPORTE') {
        precioFinal = Math.max(0, precioFinal - mayorDescuento.valor);
      } else if (mayorDescuento.tipo === 'PRODUCTO') {
        precioFinal = Math.max(0, precioFinal * (1 - mayorDescuento.valor / 100));
      }
    }

    // Formatear respuesta según contrato
    const response = {
      sku: variante.sku,
      nombre: variante.nombre,
      slug: variante.slug,
      precio: parseFloat(precioFinal.toFixed(2)),
      precioOriginal: parseFloat(precioOriginal.toFixed(2)),
      imagenUrl: variante.imagenUrl,
      images: variante.images || [],
      stock: variante.stock,
      destacado: variante.destacado,
      nuevo: variante.nuevo,
      activo: variante.activo,
      producto: {
        id: variante.producto.id,
        nombre: variante.producto.nombre,
        slug: variante.producto.slug,
        descripcion: variante.producto.descripcionLarga,
        usos: variante.producto.usos || [],
        propiedades: variante.producto.propiedades || [],
        categoria: {
          id: variante.producto.categoria.id,
          nombre: variante.producto.categoria.nombre,
          slug: variante.producto.categoria.slug
        },
        subcategoria: {
          id: variante.producto.subcategoria.id,
          nombre: variante.producto.subcategoria.nombre,
          slug: variante.producto.subcategoria.slug,
          fullSlug: `${variante.producto.categoria.slug}/${variante.producto.subcategoria.slug}`
        }
      },
      atributos: variante.atributos.map(attr => ({
        atributo: attr.atributo.nombre,
        valor: attr.valor,
        propiedades: attr.propiedades || {},
        orden: attr.VarianteAtributo.orden
      }))
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error al obtener variante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtiene todas las variantes con paginación
 */
const getVariantes = async (req, res) => {
  try {
    const { page = 1, limit = 20, categoria, subcategoria, destacado, activo } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (activo !== undefined) whereClause.activo = activo === 'true';
    if (destacado !== undefined) whereClause.destacado = destacado === 'true';

    const includeClause = [
      {
        model: Producto,
        as: 'producto',
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'slug']
          },
          {
            model: Categoria,
            as: 'subcategoria',
            attributes: ['id', 'nombre', 'slug']
          }
        ]
      }
    ];

    // Filtros por categoría
    if (categoria || subcategoria) {
      includeClause[0].where = {};
      if (categoria) {
        includeClause[0].include[0].where = { slug: categoria };
      }
      if (subcategoria) {
        includeClause[0].include[1].where = { slug: subcategoria };
      }
    }

    const { count, rows: variantes } = await VarianteProducto.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        variantes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener variantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getVarianteBySku,
  getVariantes
};