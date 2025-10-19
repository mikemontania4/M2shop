const { Router } = require('express');
const mockProductController = require('../controllers/MockProduct.controller');

const router = Router();

// Rutas mock para productos
router.get('/productos/frontend', mockProductController.listarParaFrontend);

// Rutas mock para categorías
router.get('/categorias/frontend', mockProductController.listarCategoriasParaFrontend);

module.exports = router;