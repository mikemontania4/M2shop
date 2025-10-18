const { Router } = require('express');
const productoController = require('../controllers/Producto.controller'); 
const imagenProductoController = require('../controllers/imagenProducto.controller'); 
const varianteProductoController = require('../controllers/varianteProducto.controller'); 
const atributoProductoController = require('../controllers/AtributoProducto.controller'); 

const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware.mw');
const router = Router();
// Públicas
router.get('/productos', productoController.listar);
router.get('/productos/:slug', productoController.obtenerPorSlug);

// Admin/Vendedor
router.post('/productos', authMiddleware, roleMiddleware('admin', 'vendedor'), productoController.crear);
router.put('/productos/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), productoController.actualizar);
router.delete('/productos/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), productoController.eliminar); 

// ============= RUTAS DE IMÁGENES DE PRODUCTOS =============

router.get('/productos/:productoId/imagenes', imagenProductoController.listarPorProducto);
router.post('/productos/imagenes', authMiddleware, roleMiddleware('admin', 'vendedor'), imagenProductoController.agregar);
router.put('/productos/imagenes/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), imagenProductoController.actualizar);
router.delete('/productos/imagenes/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), imagenProductoController.eliminar);

// ============= RUTAS DE VARIANTES DE PRODUCTOS =============

router.get('/productos/:productoId/variantes', varianteProductoController.listarPorProducto);
router.post('/productos/variantes', authMiddleware, roleMiddleware('admin', 'vendedor'), varianteProductoController.crear);
router.put('/productos/variantes/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), varianteProductoController.actualizar);
router.delete('/productos/variantes/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), varianteProductoController.eliminar);
router.patch('/productos/variantes/:id/stock', authMiddleware, roleMiddleware('admin', 'vendedor'), varianteProductoController.actualizarStock);

// ============= RUTAS DE ATRIBUTOS DE PRODUCTOS =============

router.get('/productos/:productoId/atributos', atributoProductoController.listarPorProducto);
router.post('/productos/atributos', authMiddleware, roleMiddleware('admin', 'vendedor'), atributoProductoController.agregar);
router.put('/productos/atributos/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), atributoProductoController.actualizar);
router.delete('/productos/atributos/:id', authMiddleware, roleMiddleware('admin', 'vendedor'), atributoProductoController.eliminar);


module.exports = router;
