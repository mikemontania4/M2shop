const { Op } = require('sequelize'); 
const { sequelize } = require('../../dbconfig');
const AtributoProducto = require('../models/AtributoProducto.models');

const agregar = async (req, res) => {
    try {
      const atributo = await AtributoProducto.create(req.body);
      res.status(201).json({ mensaje: 'Atributo agregado', atributo });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al agregar atributo', error: error.message });
    }
  }

  // Listar atributos de un producto
  const listarPorProducto = async (req, res) => {
    try {
      const { productoId } = req.params;

      const atributos = await AtributoProducto.findAll({
        where: { productoId },
        order: [['nombre', 'ASC']]
      });

      res.json(atributos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar atributos', error: error.message });
    }
  }

  // Actualizar atributo
  const actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await AtributoProducto.update(req.body, { where: { id } });

      if (!updated) {
        return res.status(404).json({ mensaje: 'Atributo no encontrado' });
      }

      const atributoActualizado = await AtributoProducto.findByPk(id);
      res.json({ mensaje: 'Atributo actualizado', atributo: atributoActualizado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar atributo', error: error.message });
    }
  }

  // Eliminar atributo
  const eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await AtributoProducto.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ mensaje: 'Atributo no encontrado' });
      }

      res.json({ mensaje: 'Atributo eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar atributo', error: error.message });
    }
  }
 
module.exports = {
agregar,listarPorProducto,actualizar,eliminar
 };
