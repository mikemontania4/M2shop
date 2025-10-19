require("dotenv").config();
const { dbConnection } = require("./dbconfig");
const migradorService = require('./src/servicios/migradorCategoriaProducto.services');
const fs = require('fs');
const path = require('path');

const runMigration = async () => {
  try {
    console.log('🔄 Iniciando migración...');
    
    // Conectar a la base de datos
    await dbConnection();
    
    // Leer archivos de migración
    const variantesConvertidosPath = path.join(__dirname, 'variantes_convertidos.json');
    const descuentosPath = path.join(__dirname, 'descuentos.json');
    
    if (fs.existsSync(variantesConvertidosPath)) {
      const variantesData = JSON.parse(fs.readFileSync(variantesConvertidosPath, 'utf8'));
      console.log(`📦 Migrando ${variantesData.length} productos/variantes...`);
      
      const resumenProductos = await migradorService.migrarProductosYVariante(variantesData);
      console.log("✅ Migración de productos y variantes completada");
      console.log(`   - Categorías: ${resumenProductos.creadas.categorias} creadas, ${resumenProductos.actualizadas.categorias} actualizadas`);
      console.log(`   - Productos: ${resumenProductos.creadas.productos} creados, ${resumenProductos.actualizadas.productos} actualizados`);
      console.log(`   - Variantes: ${resumenProductos.creadas.variantes} creadas, ${resumenProductos.actualizadas.variantes} actualizadas`);
      console.log(`   - Atributos: ${resumenProductos.creadas.atributos} creados, ${resumenProductos.actualizadas.atributos} actualizados`);
      console.log(`   - Valores Atributos: ${resumenProductos.creadas.valoresAtributos} creados, ${resumenProductos.actualizadas.valoresAtributos} actualizados`);
      console.log(`   - Variantes Atributos: ${resumenProductos.creadas.variantesAtributos} creados`);
      if (resumenProductos.errores.length > 0) {
        console.log(`   - Errores: ${resumenProductos.errores.length}`);
        console.log('   Primeros errores:', resumenProductos.errores.slice(0, 5));
      }
    } else {
      console.log("⚠️  Archivo variantes_convertidos.json no encontrado");
    }

    if (fs.existsSync(descuentosPath)) {
      const descuentosData = JSON.parse(fs.readFileSync(descuentosPath, 'utf8'));
      console.log(`💰 Migrando ${descuentosData.length} descuentos...`);
      
      const resumenDescuentos = await migradorService.migrarDescuentos(descuentosData);
      console.log("✅ Migración de descuentos completada");
      console.log(`   - Descuentos: ${resumenDescuentos.creadas.descuentos} creados, ${resumenDescuentos.actualizadas.descuentos} actualizados`);
      if (resumenDescuentos.errores.length > 0) {
        console.log(`   - Errores: ${resumenDescuentos.errores.length}`);
        console.log('   Primeros errores:', resumenDescuentos.errores.slice(0, 5));
      }
    } else {
      console.log("⚠️  Archivo descuentos.json no encontrado");
    }

    console.log('\n🎉 ¡Migración completada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
};

runMigration();