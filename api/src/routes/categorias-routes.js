const { Router } = require('express');
const categoriaController = require('../controllers/Categoria.controller'); 
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware.mw');
const router = Router();


// Públicas
router.get('/categorias', categoriaController.listar);
router.get('/categorias/:slug', categoriaController.obtenerPorSlug);

// Admin/Vendedor
router.post('/categorias', authMiddleware, roleMiddleware('admin', 'vendedor'), categoriaController.crear);
router.put('/categorias/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), categoriaController.actualizar);
router.delete('/categorias/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), categoriaController.eliminar);

module.exports = router;
