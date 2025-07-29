// API de categorías para Vercel
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Datos de categorías estáticos
  const categories = [
    {
      "id": 1,
      "name": "Tecnología",
      "description": "Dispositivos electrónicos y gadgets",
      "image_url": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400"
    },
    {
      "id": 2,
      "name": "Ropa y Calzado",
      "description": "Moda y accesorios para vestir",
      "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
    },
    {
      "id": 3,
      "name": "Hogar y Jardín",
      "description": "Artículos para el hogar y jardinería",
      "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
    },
    {
      "id": 4,
      "name": "Deportes",
      "description": "Equipamiento y ropa deportiva",
      "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    }
  ];

  res.status(200).json(categories);
}
