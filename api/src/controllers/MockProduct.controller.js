const variantesConvertidos = require('../../variantes_convertidos.json');
const categoriasGeneradas = require('../../categorias_generadas.json');
const descuentosData = require('../../descuentos.json');

// Función auxiliar para calcular precio con descuentos
const calcularPrecioConDescuento = (producto, descuentos) => {
  let precioFinal = producto.precioOriginal;

  // Aplicar descuentos
  for (const descuento of descuentos) {
    if (descuento.tipoDescuento === 'PRODUCTO') {
      precioFinal = precioFinal * (1 - descuento.descuento / 100);
    } else {
      precioFinal = Math.max(0, precioFinal - descuento.descuento);
    }
  }

  return Math.round(precioFinal * 100) / 100;
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

    let productos = variantesConvertidos.map((variante, index) => {
      // Buscar descuentos para este producto
      const descuentos = descuentosData.filter(d => d.sku === variante.sku);
      const precioConDescuento = calcularPrecioConDescuento(variante, descuentos);

      return {
        id: variante.id,
        name: variante.name,
        producto: variante.producto,
        variedad: variante.variedad,
        presentacion: variante.presentacion,
        sku: variante.sku,
        precio: precioConDescuento,
        precioOriginal: parseFloat(variante.precioOriginal) || 0,
        category: variante.category,
        subcategory: variante.subcategory,
        descripcion: variante.descripcion || '',
        stock: variante.stock || 0,
        destacado: variante.destacado || false,
        nuevo: variante.nuevo || false,
        imagen: variante.imagen || null,
        marca: variante.marca || '',
        slug: variante.sku.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      };
    });

    // Filtrar por categoría
    if (categoria || subcategoria) {
      const categoriaSlug = subcategoria || categoria;
      productos = productos.filter(p => p.category === categoriaSlug || p.subcategory === categoriaSlug);
    }

    // Filtrar por búsqueda
    if (buscar) {
      const query = buscar.toLowerCase();
      productos = productos.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.descripcion.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory?.toLowerCase().includes(query)
      );
    }

    // Filtrar por precio
    if (precioMin) {
      productos = productos.filter(p => p.precioOriginal >= parseFloat(precioMin));
    }
    if (precioMax) {
      productos = productos.filter(p => p.precioOriginal <= parseFloat(precioMax));
    }

    // Paginación
    const total = productos.length;
    const offset = (page - 1) * limit;
    const productosPaginados = productos.slice(offset, offset + parseInt(limit));

    res.json({
      total,
      paginas: Math.ceil(total / limit),
      paginaActual: parseInt(page),
      productos: productosPaginados
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos para frontend', error: error.message });
  }
};

const listarCategoriasParaFrontend = async (req, res) => {
  try {
    const categorias = categoriasGeneradas.map(categoria => ({
      id: categoria.id,
      name: categoria.name,
      description: categoria.description || '',
      image: categoria.image || '',
      subcategories: categoria.subcategories || []
    }));

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar categorías para frontend', error: error.message });
  }
};

module.exports = {
  listarParaFrontend,
  listarCategoriasParaFrontend
};