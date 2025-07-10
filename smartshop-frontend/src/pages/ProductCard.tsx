import React from 'react';

// Definimos el tipo para las props del producto para mayor claridad y seguridad de tipos.
interface Product {
  id_articulo: number;
  nombre_articulo: string;
  imagen_articulo: string;
  precio_articulo_por_formato_venta_articulo?: number;
  cantidad?: number;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onAdd, onRemove }) => {
  return (
    <div
      className={`relative border rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between p-4 bg-white min-h-[340px] sm:min-h-[360px] ${isSelected ? 'border-secondary ring-2 ring-secondary' : 'border-gray-200'}`}
    >
      <div className="flex-grow mb-4 flex flex-col items-center">
        <img
          src={product.imagen_articulo}
          alt={product.nombre_articulo}
          className="w-full h-40 sm:h-48 object-contain mb-4 rounded-md bg-gray-50"
          loading="lazy"
        />
        <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 text-center break-words line-clamp-2" title={product.nombre_articulo}>
          {product.nombre_articulo}
        </h3>
        {product.precio_articulo_por_formato_venta_articulo && (
          <p className="text-xl font-bold text-accent mb-2 text-center">
            {product.precio_articulo_por_formato_venta_articulo.toFixed(2)} €
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {isSelected ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onRemove(product)}
              className="bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl font-bold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
              aria-label={`Quitar una unidad de ${product.nombre_articulo}`}
            >
              -
            </button>
            <span className="text-2xl font-bold text-primary min-w-8 text-center select-none">{product.cantidad}</span>
            <button
              onClick={() => onAdd(product)}
              className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
              aria-label={`Añadir una unidad de ${product.nombre_articulo}`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAdd(product)}
            className="w-full bg-primary text-white py-4 px-4 rounded-xl font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-lg"
            aria-label={`Añadir ${product.nombre_articulo} a la lista`}
          >
            Añadir
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
