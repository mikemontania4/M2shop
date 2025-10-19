const { Op } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Atributo = require('../models/Atributo.models');
const ValorAtributo = require('../models/ValorAtributo.models');
const VarianteAtributo = require('../models/VarianteAtributo.models');
const VarianteProducto = require('../models/VarianteProducto.models');

/**
 * Crear un atributo nuevo (ej: "Presentación", "Color", "Variedad")
 */
const crearAtributo = async (req, res) => {
  try {
    const atributo = await Atributo.create(req.body);
    res.status(201).json({ mensaje: 'Atributo creado exitosamente', atributo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear atributo', error: error.message });
  }
};

/**
 * Agregar un valor a un atributo existente (ej: Atributo: “Color”, Valor: “#FFFFFF”)
 */
const agregarValor = async (req, res) => {
  try {
    const { atributoId, valor, orden } = req.body;

    const valorAtributo = await ValorAtributo.create({
      atributoId,
      valor,
      orden
    });

    res.status(201).json({ mensaje: 'Valor agregado al atributo', valorAtributo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar valor al atributo', error: error.message });
  }
};

/**
 * Asignar un conjunto de valores de atributo a una variante
 * Ejemplo: varianteId=1 → Color: “#fff”, Presentación: “500ml”, Variedad: “Extra”
 */
const asignarAtributosAVariante = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { varianteId, valores } = req.body;

    // valores = [{ valorAtributoId: 1, orden: 1 }, { valorAtributoId: 2, orden: 2 }]
    const asignaciones = await Promise.all(
      valores.map(v => VarianteAtributo.create({
        varianteId,
        valorAtributoId: v.valorAtributoId,
        orden: v.orden || 0
      }, { transaction }))
    );

    await transaction.commit();
    res.status(201).json({ mensaje: 'Atributos asignados a variante', asignaciones });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ mensaje: 'Error al asignar atributos a variante', error: error.message });
  }
};

/**
 * Listar todos los atributos con sus valores
 */
const listarAtributos = async (req, res) => {
  try {
    const atributos = await Atributo.findAll({
      include: [{ model: ValorAtributo, as: 'valores' }],
      order: [['orden', 'ASC']]
    });

    res.json(atributos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar atributos', error: error.message });
  }
};

/**
 * Listar los atributos aplicados a una variante específica
 */
const listarPorVariante = async (req, res) => {
  try {
    const { varianteId } = req.params;

    const atributos = await VarianteAtributo.findAll({
      where: { varianteId },
      include: [
        {
          model: ValorAtributo,
          as: 'valorAtributo',
          include: [{ model: Atributo, as: 'atributo' }]
        }
      ],
      order: [['orden', 'ASC']]
    });

    res.json(atributos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar atributos por variante', error: error.message });
  }
};

/**
 * Actualizar un atributo (nombre, tipo o su orden)
 */
const actualizarAtributo = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Atributo.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ mensaje: 'Atributo no encontrado' });

    const atributoActualizado = await Atributo.findByPk(id);
    res.json({ mensaje: 'Atributo actualizado', atributo: atributoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar atributo', error: error.message });
  }
};

/**
 * Eliminar un atributo (y sus valores asociados)
 */
const eliminarAtributo = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    await ValorAtributo.destroy({ where: { atributoId: id }, transaction });
    const deleted = await Atributo.destroy({ where: { id }, transaction });

    await transaction.commit();

    if (!deleted) return res.status(404).json({ mensaje: 'Atributo no encontrado' });

    res.json({ mensaje: 'Atributo y sus valores eliminados correctamente' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ mensaje: 'Error al eliminar atributo', error: error.message });
  }
};

module.exports = {
  crearAtributo,
  agregarValor,
  asignarAtributosAVariante,
  listarAtributos,
  listarPorVariante,
  actualizarAtributo,
  eliminarAtributo
};
