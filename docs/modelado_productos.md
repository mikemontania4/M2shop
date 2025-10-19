# Modelado de Productos y Variantes - Especificación Técnica

## Resumen Ejecutivo

Este documento define la arquitectura de datos para el sistema de productos y variantes, incluyendo los modelos de base de datos, la lógica de migración y los contratos de API. El sistema está diseñado para manejar productos con múltiples variantes (SKUs) y atributos dinámicos, con soporte para descuentos y categorización jerárquica.

## Arquitectura General

### Principio Clave
- **Producto**: Entidad base que contiene datos comunes entre variantes (usos, propiedades, descripciones, categoría)
- **VarianteProducto**: Entidad principal que representa el SKU/variante - el endpoint principal devuelve esta entidad con producto embebido
- **Atributos Dinámicos**: Sistema flexible para manejar variedad, presentación, sabor, color, etc.

## Modelos de Base de Datos

### 1. Producto (productos)

Entidad base que contiene datos comunes entre variantes.

```sql
CREATE TABLE productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  descripcion_corta TEXT,
  descripcion_larga TEXT,
  usos JSON, -- Array de usos recomendados
  propiedades JSON, -- Array de propiedades del producto
  categoria_id INTEGER NOT NULL,
  subcategoria_id INTEGER, -- FK a categorias (padre = categoria_id)
  marca_id INTEGER, -- FK opcional
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  nuevo BOOLEAN DEFAULT false,
  meta_title VARCHAR(200),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relaciones:**
- `Producto.hasMany(VarianteProducto, { foreignKey: 'productoId', as: 'variantes' })`
- `Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' })`
- `Producto.belongsTo(Categoria, { foreignKey: 'subcategoriaId' })`
- `Producto.belongsTo(Marca, { foreignKey: 'marcaId' })`

### 2. VarianteProducto (variantes_producto)

Entidad principal que representa el SKU/variante. El endpoint principal devuelve esta entidad con producto embebido.

```sql
CREATE TABLE variantes_producto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id INTEGER NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL, -- Se puede generar concatenando atributos
  slug VARCHAR(200) UNIQUE NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  precio_original DECIMAL(10,2), -- Precio sin descuentos
  imagen_url VARCHAR(255),
  images JSON, -- Array de URLs de imágenes
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  nuevo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relaciones:**
- `VarianteProducto.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' })`
- `VarianteProducto.belongsToMany(ValorAtributo, { through: VarianteAtributo, as: 'atributos' })`

### 3. Atributo (atributos)

Define tipos de atributos (ej: Variedad, Presentación, Sabor, Color, etc.).

```sql
CREATE TABLE atributos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL, -- ej. "Variedad"
  orden INTEGER NOT NULL, -- Orden de concatenación
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. ValorAtributo (valores_atributos)

Valores concretos de un atributo con propiedades para metadata.

```sql
CREATE TABLE valores_atributos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atributo_id INTEGER NOT NULL,
  valor VARCHAR(255) NOT NULL, -- ej. "Extra", "Bolsa de 10Kg"
  propiedades JSON, -- ej. { "color":"#eb961e", "imagen":"https://..." }
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relación:**
- `Atributo.hasMany(ValorAtributo, { foreignKey: 'atributoId', as: 'valores' })`

### 5. VarianteAtributo (variantes_atributos)

Tabla pivot para relacionar variantes con valores de atributo y mantener orden por variante.

```sql
CREATE TABLE variantes_atributos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variante_id INTEGER NOT NULL,
  valor_atributo_id INTEGER NOT NULL,
  orden INTEGER NOT NULL, -- Permite concatenar en orden
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Categoria (categorias)

Categorías y subcategorías. Importante evitar colisiones de slug entre subcategorías de distintas categorías.

```sql
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL, -- Recomendable único por contexto
  descripcion TEXT,
  imagen_url VARCHAR(255),
  categorias_padre_id INTEGER, -- NULL si es categoría principal
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Regla práctica:**
- Generar o exponer `fullSlug = categoria.slug + '/' + subcategoria.slug` en la API pública para evitar ambigüedades.

### 7. Descuento (descuentos)

Descuentos aplicables a variantes.

```sql
CREATE TABLE descuentos (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  variante_id INTEGER, -- FK a variantes_producto (nullable si aplica a grupos)
  activo BOOLEAN DEFAULT true,
  cant_desde DECIMAL(19,2) DEFAULT 1,
  cant_hasta DECIMAL(19,2) DEFAULT 999999999,
  fecha_desde DATE NOT NULL,
  fecha_hasta DATE NOT NULL,
  valor DECIMAL(19,2) NOT NULL,
  tipo VARCHAR(100) NOT NULL -- IMPORTE, PRODUCTO, u otros
);
```

## Contrato de Salida de API

### Endpoint Principal: GET /api/variantes/:sku

El endpoint principal devuelve la variante con producto embebido y atributos ordenados:

```json
{
  "sku": "300000243",
  "nombre": "POLVO PARA LAVAR LA ROPA GUAIRA EXTRA Bolsa de 10Kg",
  "slug": "polvo-para-lavar-la-ropa-guaira-extra-bolsa-de-10kg",
  "precio": 141900.00,
  "precioOriginal": 141900.00,
  "imagenUrl": "https://cdn.cavallaro.com.py/productos/300000243.PNG",
  "images": [
    "https://cdn.cavallaro.com.py/productos/300000243.PNG",
    "https://cdn.cavallaro.com.py/presentaciones/Bolsa de 10Kg.png"
  ],
  "stock": 0,
  "destacado": false,
  "nuevo": false,
  "activo": true,
  "producto": {
    "id": 1,
    "nombre": "POLVO PARA LAVAR LA ROPA GUAIRA EXTRA",
    "slug": "polvo-para-lavar-la-ropa-guaira-extra",
    "descripcion": "<p>El polvo para lavar la ropa Guaira Extra contiene una dosis justa de activos...</p>",
    "usos": ["Todo tipo de tejidos, ropa de cama y blanquería."],
    "propiedades": [
      "• Limpieza eficiente de los tejidos",
      "• Elimina el 99,9 % de virus, gérmenes y bacterias.",
      "• Neutraliza malos olores."
    ],
    "categoria": {
      "id": 1,
      "nombre": "Cuidado de las prendas",
      "slug": "cuidado-de-las-prendas"
    },
    "subcategoria": {
      "id": 2,
      "nombre": "jabón en polvo",
      "slug": "jabon-en-polvo",
      "fullSlug": "cuidado-de-las-prendas/jabon-en-polvo"
    }
  },
  "atributos": [
    {
      "atributo": "Variedad",
      "valor": "Extra",
      "propiedades": { "color": "#eb961e" },
      "orden": 1
    },
    {
      "atributo": "Presentación",
      "valor": "Bolsa de 10Kg",
      "propiedades": { "imagen": "https://cdn.cavallaro.com.py/presentaciones/Bolsa de 10Kg.png" },
      "orden": 2
    }
  ]
}
```

**Observación:** El producto viene embebido dentro de la variante para que el frontend tenga usos/propiedades/descripción junto con la variante.

### Otros Endpoints Mínimos

- `GET /api/productos/:slug` → producto + variantes (resumen)
- `GET /api/categorias` → árbol de categorías (incluye subcategorías y fullSlug)
- `GET /api/descuentos` → descuentos activos / CRUD de descuentos en panel

## Migrador: api/src/servicios/migradorCategoriaProducto.services.js

### Firma de Métodos

```javascript
async migrarProductosYVariante(productosArray) // Recibe array (contenido de variantes_convertidos.json)
async migrarDescuentos(descuentosArray) // Recibe array (contenido de descuentos.json)
```

### Lógica para migrarProductosYVariante(productosArray)

Por cada item del array, realizar:

#### 1. Categorías
- `item.category` → buscar/crear Categoria (slug = item.category)
- `item.subcategory` → buscar/crear Categoria con categoriasPadreId = categoria.id
- Generar/guardar fullSlug en la respuesta (no es obligatorio persistir si se puede construir en consulta)

#### 2. Producto
- Buscar/crear Producto por slug derivado de item.producto
- Mapear:
  - `item.producto` → Producto.nombre
  - `item.descripcion` → Producto.descripcionLarga
  - `item.usosRecomendados` → Producto.usos (JSON)
  - `item.propiedades` → Producto.propiedades (JSON)
  - categoriaId, subcategoriaId

#### 3. VarianteProducto
- Buscar/crear por sku
- Mapear:
  - `item.sku` → VarianteProducto.sku
  - `item.name` → VarianteProducto.nombre (o se genera)
  - `item.price` → VarianteProducto.precio
  - `item.originalPrice` → VarianteProducto.precioOriginal
  - `item.image` → VarianteProducto.imagenUrl
  - `item.images` → VarianteProducto.images
  - `item.stock` → VarianteProducto.stock
  - `item.featured` → VarianteProducto.destacado
  - activo por defecto true
  - productoId ← Producto creado/obtenido

#### 4. Atributos Dinámicos

**Variedad:**
- Atributo: "Variedad" (orden configurable, ej. 1)
- ValorAtributo.valor = item.variedad
- ValorAtributo.propiedades = { color: item.color?.[0] ?? null }
- Crear VarianteAtributo (pivot) con orden

**Presentación:**
- Atributo: "Presentación" (orden configurable, ej. 2)
- ValorAtributo.valor = item.presentacion || item.size?.[0]
- ValorAtributo.propiedades = { imagen: item.images?.[1] ?? null }
- Crear VarianteAtributo con orden

**Otros atributos detectados:** Si JSON trae sabor, voltaje, etc., crear Atributo/ValorAtributo automáticamente (no modificar código).

#### 5. Idempotencia
- Usar findOrCreate / upsert / update para no duplicar registros
- Retornar resumen { creadas, actualizadas, errores }

### Lógica para migrarDescuentos(descuentosArray)

Para cada descuento:
- Buscar VarianteProducto por sku (o usar varianteId si viene)
- Insertar/actualizar Descuento (idempotente)
- Mapear campos: valor, tipo, fechaDesde, fechaHasta, cantDesde, cantHasta, activo

## Mapeo Rápido (JSON entrante → entidad / campo DB)

| Campo JSON | Entidad/Campo DB |
|------------|------------------|
| item.category | Categoria.slug/Categoria.nombre |
| item.subcategory | Categoria (subcategoria). fullSlug = category/subcategory |
| item.producto | Producto.nombre |
| item.descripcion | Producto.descripcionLarga |
| item.usosRecomendados | Producto.usos (JSON) |
| item.propiedades | Producto.propiedades (JSON) |
| item.sku | VarianteProducto.sku |
| item.name | VarianteProducto.nombre |
| item.price | VarianteProducto.precio |
| item.originalPrice | VarianteProducto.precioOriginal |
| item.image | VarianteProducto.imagenUrl |
| item.images | VarianteProducto.images |
| item.stock | VarianteProducto.stock |
| item.featured | VarianteProducto.destacado |
| item.variedad | Atributo="Variedad" → ValorAtributo.valor |
| item.presentacion / item.size | Atributo="Presentación" → ValorAtributo.valor |
| item.color | ValorAtributo.propiedades.color |
| descuentos.json | Descuento (vinculado a varianteId o por SKU) |

## Checklist de Implementación

### 1. Modelos de Base de Datos
- [ ] Crear/actualizar modelo: Producto
- [ ] Crear/actualizar modelo: VarianteProducto
- [ ] Crear modelo: Atributo
- [ ] Crear modelo: ValorAtributo
- [ ] Crear modelo: VarianteAtributo
- [ ] Actualizar modelo: Categoria (soporte para subcategorías)
- [ ] Actualizar modelo: Descuento

### 2. Servicios de Migración
- [ ] Crear `api/src/servicios/migradorCategoriaProducto.services.js`
- [ ] Implementar `migrarProductosYVariante(productosArray)`
- [ ] Implementar `migrarDescuentos(descuentosArray)`

### 3. Inicialización de Base de Datos
- [ ] Ajustar `dbinit.js` para leer `variantes_convertidos.json` y `descuentos.json`
- [ ] Invocar migradores desde `dbinit.js`

### 4. Endpoints de API
- [ ] Implementar `GET /api/variantes/:sku` con estructura de contrato especificada
- [ ] Implementar `GET /api/productos/:slug`
- [ ] Implementar `GET /api/categorias` con fullSlug
- [ ] Implementar `GET /api/descuentos`

### 5. Testing y Validación
- [ ] Probar migración idempotente
- [ ] Verificar fullSlug en categorías
- [ ] Verificar unicidad de sku
- [ ] Verificar precios con descuentos
- [ ] Verificar orden de atributos
- [ ] Probar consumo por frontend reemplazando data/*.json

## Consideraciones Técnicas

### Performance
- Índices en campos de búsqueda frecuente (sku, slug, categoria_id)
- Considerar caché para categorías y atributos estáticos
- Optimizar consultas con includes para evitar N+1

### Escalabilidad
- El sistema de atributos dinámicos permite agregar nuevos tipos sin modificar código
- La estructura de categorías soporta múltiples niveles de jerarquía
- Los descuentos pueden aplicarse a variantes individuales o grupos

### Mantenibilidad
- Separación clara entre entidades de producto y variante
- Sistema de atributos flexible y extensible
- Migración idempotente para facilitar actualizaciones

## Notas de Implementación

1. **Producto embebido**: La información del producto se devuelve embebida dentro de la variante porque el frontend consume la página de detalle a nivel variante.

2. **FullSlug**: Se recomienda generar fullSlug dinámicamente en consultas para evitar inconsistencias, pero puede persistirse si se requiere performance.

3. **Atributos dinámicos**: El sistema detecta automáticamente nuevos tipos de atributos en el JSON de entrada, permitiendo extensibilidad sin modificar código.

4. **Idempotencia**: Todos los métodos de migración deben ser idempotentes para permitir re-ejecución sin duplicar datos.

5. **Validación**: Implementar validaciones de integridad referencial y formatos de datos antes de la migración.