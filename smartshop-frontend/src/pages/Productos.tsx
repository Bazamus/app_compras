import React, { useState, useEffect, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import FilterIcon from '../components/icons/FilterIcon';
import XIcon from '../components/icons/XIcon';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';

// --- Tipos de Datos ---
interface Category {
  id: number;
  nombre: string;
}

interface Subcategory {
  id: number;
  nombre: string;
}

interface Product {
  id_articulo: number;
  nombre_articulo: string;
  imagen_articulo: string;
  precio_articulo_por_formato_venta_articulo?: number;
  cantidad?: number;
}

// Fetchers para la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  return res.json();
};

const fetchSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  const res = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
  if (!res.ok) throw new Error('Error al cargar subcategorías');
  return res.json();
};

const fetchProducts = async (subcategoryId: string): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/subcategories/${subcategoryId}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
};

const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
};

const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/categories/${categoryId}/products`);
  if (!res.ok) throw new Error('Error al cargar productos de la categoría');
  return res.json();
};

const fetchSearchProducts = async (search: string): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products/search?nombre=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Error al buscar productos');
  return res.json();
};

const Productos: React.FC = () => {
  // Cambia la inicialización y uso de selectedCategory y selectedSubcategory a string (sin null)
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // '' = todas
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(''); // '' = todas
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('selectedProducts');
    return stored ? JSON.parse(stored) : [];
  });
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState<Product[] | null>(null);
  const [loadingGlobalSearch, setLoadingGlobalSearch] = useState(false);
  const [errorGlobalSearch, setErrorGlobalSearch] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  useEffect(() => {
    if (search.trim() !== '' && !selectedCategory && !selectedSubcategory) {
      setLoadingGlobalSearch(true);
      setErrorGlobalSearch(null);
      fetchSearchProducts(search)
        .then((data) => {
          setGlobalSearchResults(data);
        })
        .catch(() => {
          setErrorGlobalSearch('Error al buscar productos');
        })
        .finally(() => {
          setLoadingGlobalSearch(false);
        });
    } else {
      setGlobalSearchResults(null);
    }
  }, [search, selectedCategory, selectedSubcategory]);

  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: subcategories, isLoading: loadingSubcategories, error: errorSubcategories } = useQuery<Subcategory[]>({ queryKey: ['subcategories', selectedCategory], queryFn: () => fetchSubcategories(selectedCategory!), enabled: !!selectedCategory });
  const { data: productsBySubcat, isLoading: loadingProductsBySubcat, error: errorProductsBySubcat } = useQuery<Product[]>({ queryKey: ['products', selectedSubcategory], queryFn: () => fetchProducts(selectedSubcategory!), enabled: !!selectedSubcategory });
  const { data: productsByCategory, isLoading: loadingProductsByCategory, error: errorProductsByCategory } = useQuery<Product[]>({ queryKey: ['productsByCategory', selectedCategory], queryFn: () => fetchProductsByCategory(selectedCategory!), enabled: !!selectedCategory && !selectedSubcategory });
  const { data: allProducts, isLoading: loadingAllProducts, error: errorAllProducts } = useQuery<Product[]>({ queryKey: ['allProducts'], queryFn: fetchAllProducts, enabled: !search && !selectedCategory && !selectedSubcategory });

  const unaccent = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const productsToShow = (() => {
    if (search.trim() !== '') {
      if (globalSearchResults) return globalSearchResults;
      const base = selectedSubcategory ? productsBySubcat : selectedCategory ? productsByCategory : allProducts;
      return (base || []).filter(p => unaccent(p.nombre_articulo.toLowerCase()).includes(unaccent(search.toLowerCase())));
    }
    if (selectedSubcategory) return productsBySubcat;
    if (selectedCategory) return productsByCategory;
    return allProducts;
  })() || [];

  const filteredProducts = productsToShow.filter((prod) => {
    const price = prod.precio_articulo_por_formato_venta_articulo || 0;
    const matchesMin = minPrice === '' || price >= parseFloat(minPrice);
    const matchesMax = maxPrice === '' || price <= parseFloat(maxPrice);
    return matchesMin && matchesMax;
  });

  const addProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const exist = prev.find(p => p.id_articulo === product.id_articulo);
      if (exist) {
        return prev.map(p => p.id_articulo === product.id_articulo ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p);
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeOneProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const exist = prev.find(p => p.id_articulo === product.id_articulo);
      if (exist && exist.cantidad && exist.cantidad > 1) {
        return prev.map(p => p.id_articulo === product.id_articulo ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p);
      }
      return prev.filter(p => p.id_articulo !== product.id_articulo);
    });
  };

  const removeProduct = (product: Product) => {
    setSelectedProducts(prev => prev.filter(p => p.id_articulo !== product.id_articulo));
  };

  const clearSelection = () => setSelectedProducts([]);

  const totalPrice = selectedProducts.reduce((acc, prod) => acc + (prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1), 0);
  const totalUnits = selectedProducts.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);

  const isLoading = loadingAllProducts || loadingProductsByCategory || loadingProductsBySubcat || loadingGlobalSearch || loadingCategories || loadingSubcategories;
  const isError = errorAllProducts || errorProductsByCategory || errorProductsBySubcat || errorGlobalSearch || errorCategories || errorSubcategories;

  // Utilidad para detectar móvil (puedes mejorarla si usas un hook de breakpoint)
  const isMobile = window.innerWidth < 640;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-6 sticky top-0 z-40 bg-gray-50 pt-4 pb-2 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Catálogo de Productos</h1>
          <p className="text-md md:text-lg text-gray-600">Encuentra todo lo que necesitas para tu compra.</p>
        </header>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-16 z-30">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full md:hidden flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-4 text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary" aria-expanded={showFilters} aria-controls="filters-panel">
            <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
            {showFilters ? <XIcon className="w-6 h-6" /> : <FilterIcon className="w-6 h-6" />}
          </button>
          <div id="filters-panel" className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-base font-medium text-gray-700 mb-1">Buscar por nombre</label>
                <input type="text" id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej: Aceite de Girasol..." className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg" 
                  onKeyDown={isMobile ? (e => { if (e.key === 'Enter') setShowFilters(false); }) : undefined}
                  onBlur={isMobile ? (() => setShowFilters(false)) : undefined}
                />
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-base font-medium text-gray-700 mb-1">Precio Mín.</label>
                <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg" 
                  onKeyDown={isMobile ? (e => { if (e.key === 'Enter') setShowFilters(false); }) : undefined}
                  onBlur={isMobile ? (() => setShowFilters(false)) : undefined}
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-base font-medium text-gray-700 mb-1">Precio Máx.</label>
                <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="100" className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg" 
                  onKeyDown={isMobile ? (e => { if (e.key === 'Enter') setShowFilters(false); }) : undefined}
                  onBlur={isMobile ? (() => setShowFilters(false)) : undefined}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-1">Categoría</label>
                <Listbox value={selectedCategory as unknown as never} onChange={(v) => { setSelectedCategory(v as string); setSelectedSubcategory(''); }}>
                  <div className="relative">
                    {/* Botón normal */}
                    <ListboxButton
                      className="w-full rounded-lg border px-4 py-3 text-left bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
                      onClick={isMobile ? (e => { e.preventDefault(); setIsCategoryModalOpen(true); }) : undefined}
                    >
                      <span>{selectedCategory ? ((categories || []).find(cat => String(cat.id) === selectedCategory)?.nombre) : 'Todas las categorías'}</span>
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400 ml-2" />
                    </ListboxButton>
                    {/* Modal para móvil */}
                    {isMobile && isCategoryModalOpen ? (
                      <Transition appear show={isCategoryModalOpen} as={Fragment}>
                        <Dialog as={Fragment} onClose={() => setIsCategoryModalOpen(false)}>
                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
                            <div className="relative bg-white rounded-t-2xl w-full max-w-md mx-auto mt-auto pb-8 pt-4 px-4 animate-fade-in">
                              <Dialog.Title className="text-lg font-bold mb-4 text-center">Selecciona una categoría</Dialog.Title>
                              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                                <button className="text-left px-4 py-3 rounded-lg hover:bg-primary/10" onClick={() => { setSelectedCategory(''); setIsCategoryModalOpen(false); if (isMobile) setShowFilters(false); }}>Todas las categorías</button>
                                {categories?.map((cat) => (
                                  <button key={cat.id} className="text-left px-4 py-3 rounded-lg hover:bg-primary/10" onClick={() => { setSelectedCategory(String(cat.id)); setIsCategoryModalOpen(false); if (isMobile) setShowFilters(false); }}>
                                    {cat.nombre}
                                  </button>
                                ))}
                              </div>
                              <button className="mt-6 w-full py-3 rounded-lg bg-gray-200 text-primary font-semibold hover:bg-gray-300" onClick={() => setIsCategoryModalOpen(false)}>
                                Cerrar
                              </button>
                            </div>
                          </div>
                        </Dialog>
                      </Transition>
                    ) : (
                      <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-50">
                        <ListboxOption value={'' as unknown as never} className={({ active }: { active: boolean }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`}>Todas las categorías</ListboxOption>
                        {categories?.map((cat) => (
                          <ListboxOption key={cat.id} value={String(cat.id) as unknown as never} className={({ active }: { active: boolean }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`}>
                            {cat.nombre}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    )}
                  </div>
                </Listbox>
              </div>
              <div>
                <label htmlFor="subcategory" className="block text-base font-medium text-gray-700 mb-1">Subcategoría</label>
                <Listbox value={selectedSubcategory as unknown as never} onChange={(v) => setSelectedSubcategory(v as string)} disabled={!selectedCategory || loadingSubcategories}>
                  <div className="relative">
                    <ListboxButton
                      className="w-full rounded-lg border px-4 py-3 text-left bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:bg-gray-100 disabled:text-gray-400"
                      disabled={!selectedCategory || loadingSubcategories}
                      onClick={isMobile ? (e => { e.preventDefault(); setIsSubcategoryModalOpen(true); }) : undefined}
                    >
                      <span>{selectedSubcategory ? (subcategories?.find(sub => String(sub.id) === selectedSubcategory)?.nombre) : (loadingSubcategories ? 'Cargando...' : 'Todas las subcategorías')}</span>
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400 ml-2" />
                    </ListboxButton>
                    {isMobile && isSubcategoryModalOpen ? (
                      <Transition appear show={isSubcategoryModalOpen} as={Fragment}>
                        <Dialog as={Fragment} onClose={() => setIsSubcategoryModalOpen(false)}>
                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
                            <div className="relative bg-white rounded-t-2xl w-full max-w-md mx-auto mt-auto pb-8 pt-4 px-4 animate-fade-in">
                              <Dialog.Title className="text-lg font-bold mb-4 text-center">Selecciona una subcategoría</Dialog.Title>
                              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                                <button className="text-left px-4 py-3 rounded-lg hover:bg-primary/10" onClick={() => { setSelectedSubcategory(''); setIsSubcategoryModalOpen(false); if (isMobile) setShowFilters(false); }}>Todas las subcategorías</button>
                                {subcategories?.map((sub) => (
                                  <button key={sub.id} className="text-left px-4 py-3 rounded-lg hover:bg-primary/10" onClick={() => { setSelectedSubcategory(String(sub.id)); setIsSubcategoryModalOpen(false); if (isMobile) setShowFilters(false); }}>
                                    {sub.nombre}
                                  </button>
                                ))}
                              </div>
                              <button className="mt-6 w-full py-3 rounded-lg bg-gray-200 text-primary font-semibold hover:bg-gray-300" onClick={() => setIsSubcategoryModalOpen(false)}>
                                Cerrar
                              </button>
                            </div>
                          </div>
                        </Dialog>
                      </Transition>
                    ) : (
                      <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-50">
                        <ListboxOption value={'' as unknown as never} className={({ active }: { active: boolean }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`}>Todas las subcategorías</ListboxOption>
                        {subcategories?.map((sub) => (
                          <ListboxOption key={sub.id} value={String(sub.id) as unknown as never} className={({ active }: { active: boolean }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`}>
                            {sub.nombre}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    )}
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>

        {isLoading && <div className="text-center py-10 text-gray-500">Cargando...</div>}
        {isError && <div className="text-center py-10 text-red-500">Error al cargar los datos. Por favor, inténtalo de nuevo.</div>}
        {!isLoading && !isError && filteredProducts.length === 0 && <div className="text-center py-10 text-gray-500">No se encontraron productos con los filtros aplicados.</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id_articulo} product={product} isSelected={selectedProducts.some(p => p.id_articulo === product.id_articulo)} onAdd={addProduct} onRemove={removeOneProduct} />
          ))}
        </div>

        {selectedProducts.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-accent shadow-lg px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fade-in">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-4 w-full sm:w-auto">
              <span className="font-semibold text-primary text-base sm:text-lg">🛒 {totalUnits} {totalUnits > 1 ? 'productos' : 'producto'}</span>
              <span className="font-semibold text-accent text-base sm:text-lg">Total: {totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex flex-row gap-2 w-full sm:w-auto justify-center">
              <button className="bg-cyan-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-cyan-700 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setShowSelectionModal(true)}>Ver selección</button>
              <button className="bg-gray-200 text-primary px-3 py-1.5 rounded-md shadow hover:bg-gray-300 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary" onClick={clearSelection}>Limpiar</button>
              <button className="bg-accent text-white px-3 py-1.5 rounded-md shadow hover:bg-accent/80 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent" onClick={() => { localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts)); window.location.href = '/lista'; }}>Generar lista</button>
            </div>
          </div>
        )}

        {showSelectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSelectionModal(false)}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative animate-fade-in mx-4" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowSelectionModal(false)} aria-label="Cerrar"><XIcon className="w-6 h-6" /></button>
              <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">🛒 Productos seleccionados</h3>
              {selectedProducts.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No hay productos seleccionados.</div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto mb-4 pr-2">
                    {selectedProducts.map((prod) => (
                      <li key={prod.id_articulo} className="flex items-center gap-3 py-3">
                        <img src={prod.imagen_articulo} alt={prod.nombre_articulo} className="w-14 h-14 object-contain rounded-md flex-shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-primary text-base truncate">{prod.nombre_articulo}</div>
                          <div className="text-sm text-gray-600">{prod.precio_articulo_por_formato_venta_articulo?.toFixed(2)} €</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition flex-shrink-0" onClick={() => removeOneProduct(prod)} aria-label={`Quitar uno de ${prod.nombre_articulo}`}>-</button>
                          <span className="font-bold text-lg text-primary w-8 text-center">{prod.cantidad || 1}</span>
                          <button className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-green-600 transition flex-shrink-0" onClick={() => addProduct(prod)} aria-label={`Añadir uno de ${prod.nombre_articulo}`}>+</button>
                        </div>
                        <button className="ml-2 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 transition flex-shrink-0" onClick={() => removeProduct(prod)} aria-label={`Eliminar ${prod.nombre_articulo} de la lista`}><XIcon className="w-5 h-5" /></button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                    <button className="px-5 py-2 rounded-lg bg-gray-200 text-primary hover:bg-gray-300 transition" onClick={clearSelection}>Limpiar selección</button>
                    <button className="px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition" onClick={() => { localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts)); window.location.href = '/lista'; }}>Generar lista</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos; 