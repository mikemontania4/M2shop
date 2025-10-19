const express = require('express');
const router = express.Router();
const varianteController = require('../controllers/variante.controller');

// GET /api/variantes/:sku - Obtener variante por SKU
router.get('/:sku', varianteController.getVarianteBySku);

// GET /api/variantes - Obtener todas las variantes con filtros
router.get('/', varianteController.getVariantes);

module.exports = router;