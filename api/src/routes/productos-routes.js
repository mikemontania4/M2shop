const { Router } = require('express')
const productoController = require('../controllers/Producto.controller')
const imagenProductoController = require('../controllers/imagenProducto.controller')
const varianteProductoController = require('../controllers/varianteProducto.controller')
const atributoProductoController = require('../controllers/Atributo.controller')

const {
  authMiddleware,
  roleMiddleware
} = require('../middlewares/authMiddleware.mw')
const router = Router()
// Públicas
router.get('/productos', productoController.listar)
router.get('/productos/:slug', productoController.obtenerPorSlug)

// Admin/Vendedor
router.post(
  '/productos',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  productoController.crear
)
router.put(
  '/productos/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  productoController.actualizar
)
router.delete(
  '/productos/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  productoController.eliminar
)

// ============= RUTAS DE IMÁGENES DE PRODUCTOS =============

router.get(
  '/productos/:productoId/imagenes',
  imagenProductoController.listarPorProducto
)
router.post(
  '/productos/imagenes',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  imagenProductoController.agregar
)
router.put(
  '/productos/imagenes/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  imagenProductoController.actualizar
)
router.delete(
  '/productos/imagenes/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  imagenProductoController.eliminar
)

// ============= RUTAS DE VARIANTES DE PRODUCTOS =============

router.get(
  '/productos/:productoId/variantes',
  varianteProductoController.listarPorProducto
)
router.post(
  '/productos/variantes',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  varianteProductoController.crear
)
router.put(
  '/productos/variantes/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  varianteProductoController.actualizar
)
router.delete(
  '/productos/variantes/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  varianteProductoController.eliminar
)
router.patch(
  '/productos/variantes/:id/stock',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  varianteProductoController.actualizarStock
)

// ============= RUTAS DE ATRIBUTOS DE PRODUCTOS =============

// Agregar un valor a un atributo (ej: “Rojo”, “500ml”)
router.post(
  '/atributos/:atributoId/valores',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  atributoController.agregarValor
)

// Asignar valores de atributos a una variante específica
router.post(
  '/variantes/:varianteId/atributos',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  atributoController.asignarAtributosAVariante
)

// Listar todos los atributos con sus valores
router.get('/atributos', atributoController.listarAtributos)

// Listar los atributos de una variante (para mostrar en ProductDetail)
router.get(
  '/variantes/:varianteId/atributos',
  atributoController.listarPorVariante
)

// Actualizar un atributo (nombre, orden, activo, etc.)
router.put(
  '/atributos/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  atributoController.actualizarAtributo
)

// Eliminar un atributo (y sus valores)
router.delete(
  '/atributos/:id',
  authMiddleware,
  roleMiddleware('admin', 'vendedor'),
  atributoController.eliminarAtributo
)
module.exports = router
