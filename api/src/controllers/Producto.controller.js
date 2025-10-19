const { Op } = require('sequelize');
const Producto = require('../models/Producto.models');

const Categoria = require('../models/Categoria.models');
const Marca = require('../models/Marca.models');
const ImagenProducto = require('../models/ImagenProducto.models');
const VarianteProducto = require('../models/VarianteProducto.models');
const AtributoProducto = require('../models/AtributoProducto.models');
const Descuento = require('../models/Descuento.models');
 


const { sequelize } = require('../../dbconfig');

// Función auxiliar para calcular precio con descuentos
const calcularPrecioConDescuento = async (producto) => {
  try {
    // Buscar descuentos activos para el producto
    const descuentos = await Descuento.findAll({
      where: {
        productoId: producto.id,
        activo: true,
        fechaDesde: { [Op.lte]: new Date() },
        fechaHasta: { [Op.gte]: new Date() }
      }
    });

    let precioFinal = producto.precioOriginal;

    // Aplicar descuentos (se puede mejorar para manejar múltiples descuentos)
    for (const descuento of descuentos) {
      if (descuento.tipo === 'PORCENTAJE') {
        precioFinal = precioFinal * (1 - descuento.valor / 100);
      } else if (descuento.tipo === 'IMPORTE') {
        precioFinal = Math.max(0, precioFinal - descuento.valor);
      }
    }

    return Math.round(precioFinal * 100) / 100; // Redondear a 2 decimales
  } catch (error) {
    console.error('Error calculando descuento:', error);
    return producto.precioOriginal;
  }
};

const crear = async (req, res) => {
   try {
      const productoData = req.body;
      const producto = await Producto.create(productoData);

      res.status(201).json({ mensaje: 'Producto creado exitosamente', producto });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
    }
};

const listar = async (req, res) => {
  try {
      const { 
        page = 1, 
        limit = 20, 
        categoriaId, 
        marcaId, 
        destacado, 
        nuevo,
        buscar,
        precioMin,
        precioMax,
        ordenar = 'createdAt',
        orden = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const where = { activo: true };

      if (categoriaId) where.categoriaId = categoriaId;
      if (marcaId) where.marcaId = marcaId;
      if (destacado) where.destacado = destacado === 'true';
      if (nuevo) where.nuevo = nuevo === 'true';
      
      if (buscar) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${buscar}%` } },
          { descripcionCorta: { [Op.like]: `%${buscar}%` } },
          { sku: { [Op.like]: `%${buscar}%` } }
        ];
      }

      if (precioMin || precioMax) {
        where.precio = {};
        if (precioMin) where.precio[Op.gte] = precioMin;
        if (precioMax) where.precio[Op.lte] = precioMax;
      }

      const { count, rows } = await Producto.findAndCountAll({
        where,
        include: [
          { model: Categoria, attributes: ['id', 'nombre', 'slug'] },
          { model: Marca, attributes: ['id', 'nombre', 'slug', 'logoUrl'] },
          { model: ImagenProducto, where: { esPrincipal: true }, required: false },
          { model: Descuento, where: { activo: true }, required: false, as: 'descuentos' }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[ordenar, orden]]
      });

      // Calcular precios con descuentos para cada producto
      const productosConPrecios = await Promise.all(
        rows.map(async (producto) => {
          const precioConDescuento = await calcularPrecioConDescuento(producto);
          
          return {
            ...producto.toJSON(),
            precio: precioConDescuento,
            precioOriginal: producto.precioOriginal,
            // Generar el name concatenado para compatibilidad con el frontend
            name: `${producto.nombre} ${producto.variedad || ''} ${producto.presentacion || ''}`.trim()
          };
        })
      );

      res.json({
        total: count,
        paginas: Math.ceil(count / limit),
        paginaActual: parseInt(page),
        productos: productosConPrecios
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
    }
};
const obtenerPorSlug = async (req, res) => {
    try {
      const { slug } = req.params;

      const producto = await Producto.findOne({
        where: { slug, activo: true },
        include: [
          { model: Categoria, attributes: ['id', 'nombre', 'slug'] },
          { model: Marca, attributes: ['id', 'nombre', 'slug', 'logoUrl'] },
          { model: ImagenProducto },
          { model: VarianteProducto, where: { activo: true }, required: false },
          { model: AtributoProducto },
          { model: Descuento, where: { activo: true }, required: false, as: 'descuentos' }
        ]
      });

      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      // Calcular precio con descuentos
      const precioConDescuento = await calcularPrecioConDescuento(producto);
      
      const productoConPrecio = {
        ...producto.toJSON(),
        precio: precioConDescuento,
        precioOriginal: producto.precioOriginal,
        // Generar el name concatenado para compatibilidad con el frontend
        name: `${producto.nombre} ${producto.variedad || ''} ${producto.presentacion || ''}`.trim()
      };

      res.json(productoConPrecio);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
    }
};
const actualizar = async (req, res) => {
   try {
      const { id } = req.params;
      const productoData = req.body;

      const [updated] = await Producto.update(productoData, { where: { id } });

      if (!updated) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      const productoActualizado = await Producto.findByPk(id);
      res.json({ mensaje: 'Producto actualizado', producto: productoActualizado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
    }
};
 
const eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      const [updated] = await Producto.update({ activo: false }, { where: { id } });

      if (!updated) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
};


const listarParaFrontend = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      categoria, 
      subcategoria,
      buscar,
      precioMin,
      precioMax,
      ordenar = 'createdAt',
      orden = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { activo: true };

    // Buscar por categoría o subcategoría
    if (categoria || subcategoria) {
      const categoriaSlug = subcategoria || categoria;
      const categoriaEncontrada = await Categoria.findOne({ 
        where: { slug: categoriaSlug } 
      });
      
      if (categoriaEncontrada) {
        where.categoriaId = categoriaEncontrada.id;
      }
    }
    
    if (buscar) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${buscar}%` } },
        { descripcionCorta: { [Op.like]: `%${buscar}%` } },
        { sku: { [Op.like]: `%${buscar}%` } },
        { variedad: { [Op.like]: `%${buscar}%` } },
        { presentacion: { [Op.like]: `%${buscar}%` } }
      ];
    }

    if (precioMin || precioMax) {
      where.precioOriginal = {};
      if (precioMin) where.precioOriginal[Op.gte] = precioMin;
      if (precioMax) where.precioOriginal[Op.lte] = precioMax;
    }

    const { count, rows } = await Producto.findAndCountAll({
      where,
      include: [
        { model: Categoria, attributes: ['id', 'nombre', 'slug'] },
        { model: Marca, attributes: ['id', 'nombre', 'slug', 'logoUrl'] },
        { model: ImagenProducto, where: { esPrincipal: true }, required: false },
        { model: Descuento, where: { activo: true }, required: false, as: 'descuentos' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[ordenar, orden]]
    });

    // Calcular precios con descuentos y formatear para el frontend
    const productos = await Promise.all(
      rows.map(async (producto) => {
        const precioConDescuento = await calcularPrecioConDescuento(producto);
        
        return {
          id: producto.id,
          name: `${producto.nombre} ${producto.variedad || ''} ${producto.presentacion || ''}`.trim(),
          producto: producto.nombre,
          variedad: producto.variedad,
          presentacion: producto.presentacion,
          sku: producto.sku,
          precio: precioConDescuento,
          precioOriginal: producto.precioOriginal,
          category: producto.Categoria?.slug,
          subcategory: producto.Categoria?.slug,
          descripcion: producto.descripcionCorta,
          stock: producto.stock,
          destacado: producto.destacado,
          nuevo: producto.nuevo,
          imagen: producto.ImagenProductos?.[0]?.urlImagen || null,
          marca: producto.Marca?.nombre,
          slug: producto.slug
        };
      })
    );

    res.json({
      total: count,
      paginas: Math.ceil(count / limit),
      paginaActual: parseInt(page),
      productos
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos para frontend', error: error.message });
  }
};

module.exports = {
  crear,listar,obtenerPorSlug,actualizar,eliminar,listarParaFrontend
};
