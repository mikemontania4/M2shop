const { Op } = require('sequelize');
const Producto = require('../models/Producto.models');

const Categoria = require('../models/Categoria.models');
const Marca = require('../models/Marca.models');
const ImagenProducto = require('../models/ImagenProducto.models');
const VarianteProducto = require('../models/VarianteProducto.models');
const AtributoProducto = require('../models/AtributoProducto.models');
 


const { sequelize } = require('../../dbconfig');


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
          { model: ImagenProducto, where: { esPrincipal: true }, required: false }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[ordenar, orden]]
      });

      res.json({
        total: count,
        paginas: Math.ceil(count / limit),
        paginaActual: parseInt(page),
        productos: rows
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
          { model: AtributoProducto }
        ]
      });

      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      res.json(producto);
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


module.exports = {
  crear,listar,obtenerPorSlug,actualizar,eliminar
};
