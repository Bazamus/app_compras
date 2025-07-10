const fs = require('fs');
const path = require('path');

// Función para analizar el CSV
function analyzeCSV() {
    console.log('🔍 Analizando datos de Mercadona...\n');
    
    try {
        const csvPath = path.join(__dirname, 'mercadata', 'dataset_mercadona-scraper_2025-07-01_10-35-33-977.csv');
        const data = fs.readFileSync(csvPath, 'utf8');
        
        // Dividir en líneas
        const lines = data.split('\n');
        
        // Obtener headers
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        console.log('📊 COLUMNAS DISPONIBLES:');
        console.log('========================');
        headers.forEach((header, index) => {
            console.log(`${index + 1}. ${header}`);
        });
        
        console.log('\n📋 MUESTRA DE DATOS (primeros 3 registros):');
        console.log('==========================================');
        
        // Analizar primeros registros
        for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
                console.log(`\n--- Registro ${i} ---`);
                
                // Mostrar solo las columnas más importantes
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
                
                importantColumns.forEach(col => {
                    const index = headers.indexOf(col);
                    if (index !== -1 && values[index]) {
                        console.log(`${col}: ${values[index]}`);
                    }
                });
            }
        }
        
        // Contar total de registros
        const totalRecords = lines.length - 1; // Excluir header
        console.log(`\n📈 TOTAL DE REGISTROS: ${totalRecords}`);
        
        // Analizar categorías principales
        console.log('\n🏷️  CATEGORÍAS PRINCIPALES:');
        console.log('==========================');
        const categories = new Set();
        
        for (let i = 1; i < Math.min(100, lines.length); i++) { // Analizar primeros 100 registros
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
                const categoryIndex = headers.indexOf('categories/0/name');
                if (categoryIndex !== -1 && values[categoryIndex]) {
                    categories.add(values[categoryIndex]);
                }
            }
        }
        
        Array.from(categories).sort().forEach(category => {
            console.log(`- ${category}`);
        });
        
        return {
            headers,
            totalRecords,
            categories: Array.from(categories),
            sampleData: lines.slice(1, 4).map(line => {
                const values = line.split(',').map(v => v.replace(/"/g, ''));
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
                return obj;
            })
        };
        
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

// Ejecutar análisis
console.log('🚀 INICIANDO ANÁLISIS DE DATOS DE MERCADONA\n');
console.log('=' .repeat(50));

const analysis = analyzeCSV();

if (analysis) {
    const usefulColumns = identifyUsefulColumns(analysis.headers);
    const schema = suggestDatabaseSchema(usefulColumns);
    
    console.log('\n📝 RESUMEN DEL ANÁLISIS:');
    console.log('========================');
    console.log(`✅ Total de productos: ${analysis.totalRecords}`);
    console.log(`✅ Categorías encontradas: ${analysis.categories.length}`);
    console.log(`✅ Columnas útiles identificadas: ${usefulColumns.essential.length}`);
    console.log(`✅ Esquema de BD sugerido: 2 tablas principales`);
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('==================');
    console.log('1. Crear proyecto en Supabase');
    console.log('2. Implementar esquema de base de datos');
    console.log('3. Crear script de migración de datos');
    console.log('4. Filtrar y limpiar datos antes de importar');
    console.log('5. Configurar índices para búsquedas eficientes');
    
} else {
    console.log('❌ No se pudo completar el análisis');
} 