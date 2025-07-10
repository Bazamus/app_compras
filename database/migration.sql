
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
