require('dotenv').config();
const fs = require('fs');
const { parse } = require('csv-parse');
const { Client } = require('pg');
const path = require('path');

const client = new Client();

const csvPath = path.resolve(__dirname, '../mercadata/dataset_mercadona_limpios_csv.csv');
console.log('Ruta CSV utilizada:', csvPath);

// Leer y mostrar la primera línea del archivo CSV
const firstLine = fs.readFileSync(csvPath, { encoding: 'utf8' }).split('\n')[0];
console.log('Primera línea del archivo CSV:', firstLine);

async function main() {
  await client.connect();

  // Mapas para evitar duplicados y obtener IDs
  const categoryMap = new Map();
  const subcategoryMap = new Map();

  let totalFilas = 0;
  let filasConCategoria = 0;
  let productosInsertados = 0;
  let categoriasInsertadas = 0;
  let subcategoriasInsertadas = 0;
  let errores = [];
  const ejemplosCategorias = new Set();
  let columnasMostradas = false;
  let primeraFilaMostrada = false;
  let claveCategoriaPrincipal = null;

  // 1. Leer el CSV
  const parser = fs
    .createReadStream(csvPath, { encoding: 'utf8' })
    .pipe(parse({ delimiter: ';', columns: true, skip_empty_lines: true }));

  for await (const row of parser) {
    if (!columnasMostradas) {
      console.log('Nombres de columnas detectadas:', Object.keys(row));
      claveCategoriaPrincipal = Object.keys(row).find(k => k.toLowerCase().includes('categoria_principal'));
      console.log('Clave real detectada para categoria_principal_articulo:', claveCategoriaPrincipal);
      columnasMostradas = true;
    }
    if (!primeraFilaMostrada) {
      console.log('Primera fila de datos leída:', row);
      primeraFilaMostrada = true;
    }
    totalFilas++;
    const valorCategoria = claveCategoriaPrincipal ? row[claveCategoriaPrincipal] : undefined;
    if (!valorCategoria || valorCategoria.trim() === '') {
      console.log('Fila filtrada por categoría principal vacía:', row);
      console.log('Claves de la fila:', Object.keys(row));
      console.log('Valor real de categoria_principal_articulo:', JSON.stringify(valorCategoria), 'Longitud:', valorCategoria ? valorCategoria.length : 'undefined');
      continue;
    }
    filasConCategoria++;
    ejemplosCategorias.add(valorCategoria);
    let cantidad = row.cantidad_unidad_medida_articulo.replace(',', '.');
    if (cantidad === '') cantidad = null;

    // 1. Insertar categoría si no existe
    let categoryId;
    try {
      if (categoryMap.has(valorCategoria)) {
        categoryId = categoryMap.get(valorCategoria);
      } else {
        const res = await client.query(
          'INSERT INTO categories (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre=EXCLUDED.nombre RETURNING id',
          [valorCategoria]
        );
        categoryId = res.rows[0].id;
        categoryMap.set(valorCategoria, categoryId);
        categoriasInsertadas++;
        console.log(`[CATEGORÍA] Insertada/actualizada: ${valorCategoria}`);
      }
    } catch (err) {
      errores.push({tipo: 'categoria', fila: totalFilas, valor: valorCategoria, error: err.message});
      console.error(`[ERROR CATEGORÍA] Fila ${totalFilas}:`, err.message);
      continue;
    }

    // 2. Insertar subcategoría si no existe
    const subcatKey = `${row.subcategoria_articulo}__${categoryId}`;
    let subcategoryId;
    try {
      if (subcategoryMap.has(subcatKey)) {
        subcategoryId = subcategoryMap.get(subcatKey);
      } else {
        const res = await client.query(
          'INSERT INTO subcategories (nombre, category_id) VALUES ($1, $2) ON CONFLICT (nombre, category_id) DO UPDATE SET nombre=EXCLUDED.nombre RETURNING id',
          [row.subcategoria_articulo, categoryId]
        );
        subcategoryId = res.rows[0].id;
        subcategoryMap.set(subcatKey, subcategoryId);
        subcategoriasInsertadas++;
        console.log(`[SUBCATEGORÍA] Insertada/actualizada: ${row.subcategoria_articulo} (cat: ${row.categoria_principal_articulo})`);
      }
    } catch (err) {
      errores.push({tipo: 'subcategoria', fila: totalFilas, valor: row.subcategoria_articulo, error: err.message});
      console.error(`[ERROR SUBCATEGORÍA] Fila ${totalFilas}:`, err.message);
      continue;
    }

    // 3. Insertar producto
    try {
      await client.query(
        `INSERT INTO products (
          id_articulo, nombre_articulo, subcategory_id, formato_venta_articulo,
          precio_articulo_por_formato_venta_articulo, unidad_medida_articulo,
          precio_por_unidad_articulo, cantidad_unidad_medida_articulo,
          url_enlace_articulo, imagen_articulo
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (id_articulo) DO UPDATE SET
          nombre_articulo=EXCLUDED.nombre_articulo,
          subcategory_id=EXCLUDED.subcategory_id,
          formato_venta_articulo=EXCLUDED.formato_venta_articulo,
          precio_articulo_por_formato_venta_articulo=EXCLUDED.precio_articulo_por_formato_venta_articulo,
          unidad_medida_articulo=EXCLUDED.unidad_medida_articulo,
          precio_por_unidad_articulo=EXCLUDED.precio_por_unidad_articulo,
          cantidad_unidad_medida_articulo=EXCLUDED.cantidad_unidad_medida_articulo,
          url_enlace_articulo=EXCLUDED.url_enlace_articulo,
          imagen_articulo=EXCLUDED.imagen_articulo
        `,
        [
          parseInt(row.id_articulo),
          row.nombre_articulo,
          subcategoryId,
          row.formato_venta_articulo || null,
          row.precio_articulo_por_formato_venta_articulo ? parseFloat(row.precio_articulo_por_formato_venta_articulo.replace(',', '.')) : null,
          row.unidad_medida_articulo || null,
          row.precio_por_unidad_articulo ? parseFloat(row.precio_por_unidad_articulo.replace(',', '.')) : null,
          cantidad ? parseFloat(cantidad) : null,
          row.url_enlace_articulo || null,
          row.imagen_articulo || null,
        ]
      );
      productosInsertados++;
      if (productosInsertados % 500 === 0) {
        console.log(`[PRODUCTO] Insertados: ${productosInsertados}`);
      }
    } catch (err) {
      errores.push({tipo: 'producto', fila: totalFilas, valor: row.id_articulo, error: err.message});
      console.error(`[ERROR PRODUCTO] Fila ${totalFilas} (id: ${row.id_articulo}):`, err.message);
      continue;
    }
  }

  await client.end();
  console.log('Importación completada.');
  console.log('Total filas leídas:', totalFilas);
  console.log('Filas con categoría principal válida:', filasConCategoria);
  console.log('Categorías insertadas:', categoriasInsertadas);
  console.log('Subcategorías insertadas:', subcategoriasInsertadas);
  console.log('Productos insertados:', productosInsertados);
  console.log('Ejemplos de categorías principales:', Array.from(ejemplosCategorias).slice(0, 10));
  if (errores.length > 0) {
    console.log('Errores detectados:', errores.length);
    console.log('Ejemplo de errores:', errores.slice(0, 5));
  } else {
    console.log('No se detectaron errores de inserción.');
  }
}

main().catch((err) => {
  console.error('Error en la importación:', err);
  client.end();
});