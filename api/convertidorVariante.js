const fs = require("fs");
const variantes = require("./variantes.json");

// ✅ Función para limpiar y normalizar textos
function normalizeText(str) {
  if (!str) return "";
  return str
    .normalize("NFD") // separa acentos de las letras
    .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
    .replace(/ñ/g, "n") // reemplaza ñ manualmente
    .replace(/[^a-zA-Z0-9\s-]/g, "") // elimina caracteres especiales
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // reemplaza espacios por guiones
}

// 🔁 Función para transformar los datos
const convertProductos = (data) => {
  return data.map((p, index) => {
    const name = p.titulo.trim();
    const category = normalizeText(p.categoria);
    const subcategory = normalizeText(p.categoria2);
    const descripcionHTML = `<p>${p.descripcion}</p>`;

    const propiedadesArray = p.propiedades
      ? p.propiedades
          .split("\n")
          .map((x) => x.trim())
          .filter((x) => x.length > 0)
      : [];

    const usosArray = p.usosrecomendados ? [p.usosrecomendados.trim()] : [];

    // Determinar precios y descuento
    const originalPrice =
      p.descuento && p.descuento !== "X"
        ? parseFloat(p.precio).toFixed(0)
        : p.precio;

    const price =
      p.descuento && p.descuento !== "X"
        ? (parseFloat(p.precio) * (1 - parseFloat(p.descuento) / 100)).toFixed(0)
        : parseFloat(p.precio).toFixed(0);

    return {
      id: index + 1,
      name,
      category,
      subcategory,
      sku: p.codproductoerp,
      image: p.img1,
      images: [p.img1, p.img2].filter(Boolean),
      price,
      originalPrice,
      size: [p.presentacion],
      featured: false,
      descripcion: descripcionHTML,
      usosRecomendados: usosArray,
      propiedades: propiedadesArray,
      stock: 0,
      color: p.color ? [p.color] : []
    };
  });
};

// 🔄 Ejecutar conversión
const resultado = convertProductos(variantes);

// 💾 Guardar en archivo JSON
fs.writeFileSync("variantes_convertidos.json", JSON.stringify(resultado, null, 2), "utf8");

console.log("✅ Conversión completada. Archivo generado: variantes_convertidos.json");
