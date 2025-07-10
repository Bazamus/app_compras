const fs = require('fs');
const path = require('path');

// Función para parsear CSV correctamente
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = parseCSVLine(lines[0]);
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }
    
    return { headers, data };
}

// Función para parsear una línea CSV respetando comillas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result.map(field => field.replace(/^"|"$/g, ''));
}

// Función para analizar el CSV
function analyzeCSV() {
    console.log('🔍 Analizando datos de Mercadona...\n');
    
    try {
        const csvPath = path.join(__dirname, 'mercadata', 'dataset_mercadona-scraper_2025-07-01_10-35-33-977.csv');
        const data = fs.readFileSync(csvPath, 'utf8');
        
        const { headers, data: rows } = parseCSV(data);
        
        console.log('📊 COLUMNAS DISPONIBLES:');
        console.log('========================');
        headers.forEach((header, index) => {
            console.log(`${index + 1}. ${header}`);
        });
        
        console.log('\n📋 MUESTRA DE DATOS (primeros 3 registros):');
        console.log('==========================================');
        
        // Mostrar primeros 3 registros con columnas importantes
        const importantColumns = [
            'display_name',
            'id',
            'categories/0/name',
            'categories/0/categories/0/name',
            'price_instructions/unit_price',
            'price_instructions/unit_name',
            'price_instructions/unit_size',
            'packaging',
            'thumbnail'
        ];
        
        for (let i = 0; i < Math.min(3, rows.length); i++) {
            console.log(`\n--- Registro ${i + 1} ---`);
            importantColumns.forEach(col => {
                if (rows[i][col]) {
                    console.log(`${col}: ${rows[i][col]}`);
                }
            });
        }
        
        console.log(`\n📈 TOTAL DE REGISTROS: ${rows.length}`);
        
        // Analizar categorías principales
        console.log('\n🏷️  CATEGORÍAS PRINCIPALES:');
        console.log('==========================');
        const categories = new Set();
        
        for (let i = 0; i < Math.min(100, rows.length); i++) {
            const category = rows[i]['categories/0/name'];
            if (category) {
                categories.add(category);
            }
        }
        
        Array.from(categories).sort().forEach(category => {
            console.log(`- ${category}`);
        });
        
        // Analizar subcategorías
        console.log('\n🏷️  SUBCATEGORÍAS (primeras 20):');
        console.log('================================');
        const subcategories = new Set();
        
        for (let i = 0; i < Math.min(100, rows.length); i++) {
            const subcategory = rows[i]['categories/0/categories/0/name'];
            if (subcategory) {
                subcategories.add(subcategory);
            }
        }
        
        Array.from(subcategories).sort().slice(0, 20).forEach(subcategory => {
            console.log(`- ${subcategory}`);
        });
        
        return { headers, data: rows, totalRecords: rows.length, categories: Array.from(categories) };
        
    } catch (error) {
        console.error('❌ Error al leer el archivo CSV:', error.message);
        return null;
    }
}

// Función para identificar columnas útiles
function identifyUsefulColumns(headers) {
    console.log('\n🎯 COLUMNAS ÚTILES PARA NUESTRO PROYECTO:');
    console.log('==========================================');
    
    const usefulColumns = {
        essential: [
            'id',
            'display_name',
            'categories/0/name',
            'categories/0/categories/0/name',
            'price_instructions/unit_price',
            'price_instructions/unit_name',
            'price_instructions/unit_size',
            'packaging',
            'thumbnail'
        ],
        optional: [
            'price_instructions/bulk_price',
            'price_instructions/reference_price',
            'price_instructions/iva',
            'price_instructions/tax_percentage',
            'share_url',
            'slug',
            'status',
            'published'
        ],
        notUseful: [
            'badges/is_water',
            'badges/requires_age_check',
            'limit',
            'price_instructions/approx_size',
            'price_instructions/bunch_selector',
            'price_instructions/drained_weight',
            'price_instructions/increment_bunch_amount',
            'price_instructions/is_new',
            'price_instructions/is_pack',
            'price_instructions/min_bunch_amount',
            'price_instructions/pack_size',
            'price_instructions/previous_unit_price',
            'price_instructions/price_decreased',
            'price_instructions/reference_format',
            'price_instructions/selling_method',
            'price_instructions/size_format',
            'price_instructions/total_units',
            'price_instructions/unit_selector',
            'unavailable_from',
            'unavailable_weekdays/0',
            'unavailable_weekdays/1',
            'unavailable_weekdays/2'
        ]
    };
    
    console.log('\n✅ ESENCIALES:');
    usefulColumns.essential.forEach(col => {
        const exists = headers.includes(col);
        console.log(`${exists ? '✅' : '❌'} ${col}`);
    });
    
    console.log('\n📋 OPCIONALES:');
    usefulColumns.optional.forEach(col => {
        const exists = headers.includes(col);
        console.log(`${exists ? '✅' : '❌'} ${col}`);
    });
    
    console.log('\n❌ NO ÚTILES:');
    usefulColumns.notUseful.forEach(col => {
        const exists = headers.includes(col);
        console.log(`${exists ? '⚠️' : '✅'} ${col}`);
    });
    
    return usefulColumns;
}

// Función para sugerir esquema de base de datos
function suggestDatabaseSchema(usefulColumns) {
    console.log('\n🗄️  ESQUEMA SUGERIDO PARA SUPABASE:');
    console.log('===================================');
    
    const schema = {
        products: {
            id: 'INTEGER PRIMARY KEY',
            display_name: 'TEXT NOT NULL',
            category_main: 'TEXT',
            category_sub: 'TEXT',
            unit_price: 'DECIMAL(10,2)',
            unit_name: 'TEXT',
            unit_size: 'DECIMAL(10,3)',
            packaging: 'TEXT',
            thumbnail_url: 'TEXT',
            bulk_price: 'DECIMAL(10,2)',
            reference_price: 'DECIMAL(10,2)',
            iva: 'INTEGER',
            tax_percentage: 'DECIMAL(5,2)',
            share_url: 'TEXT',
            slug: 'TEXT',
            status: 'TEXT',
            published: 'BOOLEAN',
            created_at: 'TIMESTAMP DEFAULT NOW()',
            updated_at: 'TIMESTAMP DEFAULT NOW()'
        },
        categories: {
            id: 'SERIAL PRIMARY KEY',
            name: 'TEXT UNIQUE NOT NULL',
            parent_id: 'INTEGER REFERENCES categories(id)',
            level: 'INTEGER',
            order_index: 'INTEGER',
            created_at: 'TIMESTAMP DEFAULT NOW()'
        }
    };
    
    console.log('\n📦 TABLA: products');
    Object.entries(schema.products).forEach(([column, type]) => {
        console.log(`  ${column}: ${type}`);
    });
    
    console.log('\n🏷️  TABLA: categories');
    Object.entries(schema.categories).forEach(([column, type]) => {
        console.log(`  ${column}: ${type}`);
    });
    
    return schema;
}

// Función para crear script de migración
function createMigrationScript(analysis) {
    console.log('\n📝 CREANDO SCRIPT DE MIGRACIÓN:');
    console.log('===============================');
    
    const migrationScript = `
-- Script de migración para Supabase
-- Generado automáticamente desde análisis de datos de Mercadona

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    level INTEGER,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    display_name TEXT NOT NULL,
    category_main TEXT,
    category_sub TEXT,
    unit_price DECIMAL(10,2),
    unit_name TEXT,
    unit_size DECIMAL(10,3),
    packaging TEXT,
    thumbnail_url TEXT,
    bulk_price DECIMAL(10,2),
    reference_price DECIMAL(10,2),
    iva INTEGER,
    tax_percentage DECIMAL(5,2),
    share_url TEXT,
    slug TEXT,
    status TEXT,
    published BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_products_display_name ON products(display_name);
CREATE INDEX IF NOT EXISTS idx_products_category_main ON products(category_main);
CREATE INDEX IF NOT EXISTS idx_products_category_sub ON products(category_sub);
CREATE INDEX IF NOT EXISTS idx_products_unit_price ON products(unit_price);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso público de solo lectura
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);
`;

    // Guardar script de migración
    fs.writeFileSync('database/migration.sql', migrationScript);
    console.log('✅ Script de migración guardado en: database/migration.sql');
    
    return migrationScript;
}

// Ejecutar análisis
console.log('🚀 INICIANDO ANÁLISIS MEJORADO DE DATOS DE MERCADONA\n');
console.log('=' .repeat(50));

const analysis = analyzeCSV();

if (analysis) {
    const usefulColumns = identifyUsefulColumns(analysis.headers);
    const schema = suggestDatabaseSchema(usefulColumns);
    
    // Crear directorio database si no existe
    if (!fs.existsSync('database')) {
        fs.mkdirSync('database');
    }
    
    const migrationScript = createMigrationScript(analysis);
    
    console.log('\n📝 RESUMEN DEL ANÁLISIS:');
    console.log('========================');
    console.log(`✅ Total de productos: ${analysis.totalRecords}`);
    console.log(`✅ Categorías encontradas: ${analysis.categories.length}`);
    console.log(`✅ Columnas útiles identificadas: ${usefulColumns.essential.length}`);
    console.log(`✅ Esquema de BD sugerido: 2 tablas principales`);
    console.log(`✅ Script de migración generado`);
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('==================');
    console.log('1. ✅ Análisis de datos completado');
    console.log('2. 🔄 Crear proyecto en Supabase');
    console.log('3. 🔄 Ejecutar script de migración');
    console.log('4. 🔄 Crear script de importación de datos');
    console.log('5. 🔄 Configurar índices para búsquedas eficientes');
    
} else {
    console.log('❌ No se pudo completar el análisis');
} 