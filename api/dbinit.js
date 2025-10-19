const bcrypt = require('bcrypt');
const Usuario = require("./src/models/Usuario.models");
const Pais = require("./src/models/Pais.models");
const Departamento = require("./src/models/Departamento.models");
const Ciudad = require("./src/models/Ciudad.models");
const Barrio = require("./src/models/Barrio.models");
const DireccionEnvio = require("./src/models/DireccionEnvio.models");
const Categoria = require("./src/models/Categoria.models");
const Marca = require("./src/models/Marca.models");
const Producto = require("./src/models/Producto.models");
const ImagenProducto = require("./src/models/ImagenProducto.models");
const VarianteProducto = require("./src/models/VarianteProducto.models");
const AtributoProducto = require("./src/models/AtributoProducto.models");
const Carrito = require("./src/models/Carrito.models");
const ItemCarrito = require("./src/models/ItemCarrito.models");

const Pedido = require("./src/models/Pedido.models");
const ItemPedido = require("./src/models/ItemPedido.models");
const HistorialPedido = require("./src/models/HistorialPedido.models");
const Cupon = require("./src/models/Cupon.models");
const UsoCupon = require("./src/models/UsoCupon.models");

const Resena = require("./src/models/Resena.models");
const ListaDeseos = require("./src/models/ListaDeseos.models");
const MetodoEnvio = require("./src/models/MetodoEnvio.models");
const ConfiguracionSitio = require("./src/models/ConfiguracionSitio.models");
const Descuento = require("./src/models/Descuento.models");
 

// Datos de ejemplo
const datosEjemplo = require('./datos.json');
const Banner = require('./src/models/Banner.models');

// Datos de migración
const variantesConvertidos = require('./variantes_convertidos.json');
const categoriasGeneradas = require('./categorias_generadas.json');
const descuentosData = require('./descuentos.json');

const populateDB = async () => {
  console.log("🔄 Iniciando población de base de datos...");
  
  if (process.env.DB_INIT !== "true") {
    console.log("⚠️  DB_INIT no está habilitado. Saltando población.");
    return;
  }

  try {
    console.log("📦 Inicializando registros en DB!");

     // ============= 5. USUARIOS =============
    console.log("5️⃣  Insertando usuarios...");
    for (const usuario of datosEjemplo.usuarios) {
      const usuarioExiste = await Usuario.findOne({ where: { email: usuario.email } });
      
      if (!usuarioExiste) {
        // Generar hash real de la contraseña
        const passwordHash = await bcrypt.hash('password123', 10);
        await Usuario.create({
          ...usuario,
          password: passwordHash
        });
      }
    }
    console.log("✅ Usuarios insertados (password: password123)");


    // ============= 1. PAÍSES =============
    console.log("1️⃣  Insertando países...");
    for (const pais of datosEjemplo.paises) {
      await Pais.findOrCreate({
        where: { id: pais.id },
        defaults: pais
      });
    }
    console.log("✅ Países insertados");

    // ============= 2. DEPARTAMENTOS =============
    console.log("2️⃣  Insertando departamentos...");
    for (const depto of datosEjemplo.departamentos) {
      await Departamento.findOrCreate({
        where: { id: depto.id },
        defaults: depto
      });
    }
    console.log("✅ Departamentos insertados");

    // ============= 3. CIUDADES =============
    console.log("3️⃣  Insertando ciudades...");
    for (const ciudad of datosEjemplo.ciudades) {
      await Ciudad.findOrCreate({
        where: { id: ciudad.id },
        defaults: ciudad
      });
    }
    console.log("✅ Ciudades insertadas");

    // ============= 4. BARRIOS =============
    console.log("4️⃣  Insertando barrios...");
    for (const barrio of datosEjemplo.barrios) {
      await Barrio.findOrCreate({
        where: { id: barrio.id },
        defaults: barrio
      });
    }
    console.log("✅ Barrios insertados");

   
    // ============= 6. DIRECCIONES DE ENVÍO =============
    console.log("6️⃣  Insertando direcciones de envío...");
    for (const direccion of datosEjemplo.direccionesEnvio) {
      await DireccionEnvio.findOrCreate({
        where: { id: direccion.id },
        defaults: direccion
      });
    }
    console.log("✅ Direcciones insertadas");

    // ============= 7. MARCAS =============
    console.log("7️⃣  Insertando marcas...");
    for (const marca of datosEjemplo.marcas) {
      await Marca.findOrCreate({
        where: { slug: marca.slug },
        defaults: marca
      });
    }
    console.log("✅ Marcas insertadas");

    // ============= 8. CATEGORÍAS =============
    console.log("8️⃣  Insertando categorías...");
    for (const categoria of datosEjemplo.categorias) {
      await Categoria.findOrCreate({
        where: { slug: categoria.slug },
        defaults: categoria
      });
    }
    console.log("✅ Categorías insertadas");

    // ============= 9. PRODUCTOS =============
    console.log("9️⃣  Insertando productos...");
    for (const producto of datosEjemplo.productos) {
      await Producto.findOrCreate({
        where: { sku: producto.sku },
        defaults: producto
      });
    }
    console.log("✅ Productos insertados");

    // ============= 10. IMÁGENES DE PRODUCTOS =============
    console.log("🔟 Insertando imágenes de productos...");
    for (const imagen of datosEjemplo.imagenesProducto) {
      await ImagenProducto.findOrCreate({
        where: { id: imagen.id },
        defaults: imagen
      });
    }
    console.log("✅ Imágenes insertadas");

    // ============= 11. VARIANTES DE PRODUCTOS =============
    console.log("1️⃣1️⃣  Insertando variantes de productos...");
    for (const variante of datosEjemplo.variantesProducto) {
      await VarianteProducto.findOrCreate({
        where: { sku: variante.sku },
        defaults: variante
      });
    }
    console.log("✅ Variantes insertadas");

    // ============= 12. ATRIBUTOS DE PRODUCTOS =============
    console.log("1️⃣2️⃣  Insertando atributos de productos...");
    for (const atributo of datosEjemplo.atributosProducto) {
      await AtributoProducto.findOrCreate({
        where: { id: atributo.id },
        defaults: atributo
      });
    }
    console.log("✅ Atributos insertados");

    // ============= 13. CARRITOS =============
    console.log("1️⃣3️⃣  Insertando carritos...");
    for (const carrito of datosEjemplo.carritos) {
      await Carrito.findOrCreate({
        where: { id: carrito.id },
        defaults: carrito
      });
    }
    console.log("✅ Carritos insertados");

    // ============= 14. ITEMS DE CARRITO =============
    console.log("1️⃣4️⃣  Insertando items de carrito...");
    for (const item of datosEjemplo.itemsCarrito) {
      await ItemCarrito.findOrCreate({
        where: { id: item.id },
        defaults: item
      });
    }
    console.log("✅ Items de carrito insertados");

    // ============= 15. PEDIDOS =============
    console.log("1️⃣5️⃣  Insertando pedidos...");
    for (const pedido of datosEjemplo.pedidos) {
      await Pedido.findOrCreate({
        where: { numeroPedido: pedido.numeroPedido },
        defaults: pedido
      });
    }
    console.log("✅ Pedidos insertados");

    // ============= 16. ITEMS DE PEDIDO =============
    console.log("1️⃣6️⃣  Insertando items de pedido...");
    for (const item of datosEjemplo.itemsPedido) {
      await ItemPedido.findOrCreate({
        where: { id: item.id },
        defaults: item
      });
    }
    console.log("✅ Items de pedido insertados");

    // ============= 17. HISTORIAL DE PEDIDOS =============
    console.log("1️⃣7️⃣  Insertando historial de pedidos...");
    for (const historial of datosEjemplo.historialPedido) {
      await HistorialPedido.findOrCreate({
        where: { id: historial.id },
        defaults: historial
      });
    }
    console.log("✅ Historial de pedidos insertado");

    // ============= 18. CUPONES =============
    console.log("1️⃣8️⃣  Insertando cupones...");
    console.log('Cupones a insertar:', datosEjemplo.cupones);
    for (const cupon of datosEjemplo.cupones) {

      await Cupon.findOrCreate({
        where: { codigo: cupon.codigo },
        defaults: cupon
      });
    }
    console.log("✅ Cupones insertados");

    // ============= 19. USO DE CUPONES =============
    console.log("1️⃣9️⃣  Insertando uso de cupones...");
    for (const uso of datosEjemplo.usoCupones) {
      await UsoCupon.findOrCreate({
        where: { id: uso.id },
        defaults: uso
      });
    }
    console.log("✅ Uso de cupones insertado");

    // ============= 20. RESEÑAS =============
    console.log("2️⃣0️⃣  Insertando reseñas...");
    for (const resena of datosEjemplo.resenas) {
      await Resena.findOrCreate({
        where: { id: resena.id },
        defaults: resena
      });
    }
    console.log("✅ Reseñas insertadas");

    // ============= 21. LISTA DE DESEOS =============
    console.log("2️⃣1️⃣  Insertando lista de deseos...");
    for (const item of datosEjemplo.listaDeseos) {
      await ListaDeseos.findOrCreate({
        where: { id: item.id },
        defaults: item
      });
    }
    console.log("✅ Lista de deseos insertada");

    // ============= 22. MÉTODOS DE ENVÍO =============
    console.log("2️⃣2️⃣  Insertando métodos de envío...");
    for (const metodo of datosEjemplo.metodosEnvio) {
      await MetodoEnvio.findOrCreate({
        where: { id: metodo.id },
        defaults: metodo
      });
    }
    console.log("✅ Métodos de envío insertados");

    // ============= 23. CONFIGURACIÓN DEL SITIO =============
    console.log("2️⃣3️⃣  Insertando configuración del sitio...");
    for (const config of datosEjemplo.configuracionSitio) {
      await ConfiguracionSitio.findOrCreate({
        where: { clave: config.clave },
        defaults: config
      });
    }
    console.log("✅ Configuración del sitio insertada");

    // ============= 24. BANNERS =============
console.log("📸 Insertando banners...");
for (const banner of datosEjemplo.banners) {
  await Banner.findOrCreate({
    where: { id: banner.id },
    defaults: banner
  });
}
console.log("✅ Banners insertados");

    // ============= 25. CATEGORÍAS GENERADAS =============
    console.log("2️⃣5️⃣  Insertando categorías generadas...");
    for (const categoria of categoriasGeneradas) {
      // Crear categoría principal
      const categoriaPrincipal = await Categoria.findOrCreate({
        where: { slug: categoria.id },
        defaults: {
          nombre: categoria.name,
          slug: categoria.id,
          descripcion: categoria.description || '',
          imagenUrl: categoria.image || null,
          activo: true
        }
      });

      // Crear subcategorías si existen
      if (categoria.subcategories && categoria.subcategories.length > 0) {
        for (const subcategoria of categoria.subcategories) {
          await Categoria.findOrCreate({
            where: { slug: subcategoria.id },
            defaults: {
              nombre: subcategoria.name,
              slug: subcategoria.id,
              descripcion: subcategoria.description || '',
              imagenUrl: subcategoria.image || null,
              categoriasPadreId: categoriaPrincipal[0].id,
              activo: true
            }
          });
        }
      }
    }
    console.log("✅ Categorías generadas insertadas");

    // ============= 26. PRODUCTOS DESDE VARIANTES CONVERTIDOS =============
    console.log("2️⃣6️⃣  Insertando productos desde variantes convertidos...");
    for (const variante of variantesConvertidos) {
      // Buscar la categoría por slug
      const categoria = await Categoria.findOne({ 
        where: { slug: variante.subcategory || variante.category } 
      });

      if (categoria) {
        await Producto.findOrCreate({
          where: { sku: variante.sku },
          defaults: {
            sku: variante.sku,
            nombre: variante.producto,
            slug: variante.sku.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            descripcionCorta: variante.descripcion || '',
            precioOriginal: parseFloat(variante.precioOriginal) || 0,
            precio: parseFloat(variante.precio) || parseFloat(variante.precioOriginal) || 0,
            variedad: variante.variedad,
            presentacion: variante.presentacion,
            categoriaId: categoria.id,
            stock: variante.stock || 0,
            activo: true
          }
        });
      }
    }
    console.log("✅ Productos desde variantes insertados");

    // ============= 27. DESCUENTOS =============
    console.log("2️⃣7️⃣  Insertando descuentos...");
    for (const descuentoData of descuentosData) {
      // Buscar el producto por SKU
      const producto = await Producto.findOne({ where: { sku: descuentoData.sku } });
      
      if (producto) {
        await Descuento.findOrCreate({
          where: { 
            productoId: producto.id,
            sku: descuentoData.sku,
            tipo: descuentoData.tipoDescuento === 'PRODUCTO' ? 'PORCENTAJE' : 'IMPORTE'
          },
          defaults: {
            productoId: producto.id,
            sku: descuentoData.sku,
            valor: parseFloat(descuentoData.descuento),
            tipo: descuentoData.tipoDescuento === 'PRODUCTO' ? 'PORCENTAJE' : 'IMPORTE',
            cantDesde: parseFloat(descuentoData.cantDesde) || 1,
            cantHasta: parseFloat(descuentoData.cantHasta) || 999999999,
            fechaDesde: new Date(),
            fechaHasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año desde ahora
            activo: true
          }
        });
      }
    }
    console.log("✅ Descuentos insertados");

    console.log("\n🎉 ¡Base de datos poblada exitosamente!");
    console.log("\n📊 Resumen:");
    console.log(`   - ${datosEjemplo.paises.length} países`);
    console.log(`   - ${datosEjemplo.departamentos.length} departamentos`);
    console.log(`   - ${datosEjemplo.ciudades.length} ciudades`);
    console.log(`   - ${datosEjemplo.barrios.length} barrios`);
    console.log(`   - ${datosEjemplo.usuarios.length} usuarios`);
    console.log(`   - ${datosEjemplo.direccionesEnvio.length} direcciones de envío`);
    console.log(`   - ${datosEjemplo.marcas.length} marcas`);
    console.log(`   - ${datosEjemplo.categorias.length} categorías`);
    console.log(`   - ${datosEjemplo.productos.length} productos`);
    console.log(`   - ${datosEjemplo.imagenesProducto.length} imágenes de productos`);
    console.log(`   - ${datosEjemplo.variantesProducto.length} variantes de productos`);
    console.log(`   - ${datosEjemplo.atributosProducto.length} atributos de productos`);
    console.log(`   - ${datosEjemplo.carritos.length} carritos`);
    console.log(`   - ${datosEjemplo.itemsCarrito.length} items de carrito`);
    console.log(`   - ${datosEjemplo.pedidos.length} pedidos`);
    console.log(`   - ${datosEjemplo.itemsPedido.length} items de pedido`);
    console.log(`   - ${datosEjemplo.historialPedido.length} registros de historial`);
    console.log(`   - ${datosEjemplo.cupones.length} cupones`);
    console.log(`   - ${datosEjemplo.usoCupones.length} usos de cupones`);
    console.log(`   - ${datosEjemplo.resenas.length} reseñas`);
    console.log(`   - ${datosEjemplo.listaDeseos.length} items en lista de deseos`);
    console.log(`   - ${datosEjemplo.metodosEnvio.length} métodos de envío`);
    console.log(`   - ${datosEjemplo.configuracionSitio.length} configuraciones`);
    console.log(`   - ${datosEjemplo.banners.length} banners`);
    console.log(`   - ${categoriasGeneradas.length} categorías generadas`);
    console.log(`   - ${variantesConvertidos.length} productos desde variantes`);
    console.log(`   - ${descuentosData.length} descuentos`);
    console.log("\n👤 Usuarios creados:");
    console.log("   - admin@cavallaro.com.py (Admin)");
    console.log("   - vendedor@cavallaro.com.py (Vendedor)");
    console.log("   - juan.perez@gmail.com (Cliente)");
    console.log("   - ana.martinez@hotmail.com (Cliente)");
    console.log("   - roberto.gomez@yahoo.com (Cliente)");
    console.log("   📝 Password para todos: password123");

  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    throw error;
  }
};
 
module.exports = { populateDB  };