import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import FilterIcon from '../components/icons/FilterIcon';
import XIcon from '../components/icons/XIcon';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
// Fetchers para la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok)
        throw new Error('Error al cargar categorías');
    return res.json();
};
const fetchSubcategories = async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
    if (!res.ok)
        throw new Error('Error al cargar subcategorías');
    return res.json();
};
const fetchProducts = async (subcategoryId) => {
    const res = await fetch(`${API_URL}/subcategories/${subcategoryId}/products`);
    if (!res.ok)
        throw new Error('Error al cargar productos');
    return res.json();
};
const fetchAllProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok)
        throw new Error('Error al cargar productos');
    return res.json();
};
const fetchProductsByCategory = async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}/products`);
    if (!res.ok)
        throw new Error('Error al cargar productos de la categoría');
    return res.json();
};
const fetchSearchProducts = async (search) => {
    const res = await fetch(`${API_URL}/products/search?nombre=${encodeURIComponent(search)}`);
    if (!res.ok)
        throw new Error('Error al buscar productos');
    return res.json();
};
const Productos = () => {
    // Cambia la inicialización y uso de selectedCategory y selectedSubcategory a string (sin null)
    const [selectedCategory, setSelectedCategory] = useState(''); // '' = todas
    const [selectedSubcategory, setSelectedSubcategory] = useState(''); // '' = todas
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(() => {
        const stored = localStorage.getItem('selectedProducts');
        return stored ? JSON.parse(stored) : [];
    });
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [globalSearchResults, setGlobalSearchResults] = useState(null);
    const [loadingGlobalSearch, setLoadingGlobalSearch] = useState(false);
    const [errorGlobalSearch, setErrorGlobalSearch] = useState(null);
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
        }
        else {
            setGlobalSearchResults(null);
        }
    }, [search, selectedCategory, selectedSubcategory]);
    const { data: categories, isLoading: loadingCategories, error: errorCategories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
    const { data: subcategories, isLoading: loadingSubcategories, error: errorSubcategories } = useQuery({ queryKey: ['subcategories', selectedCategory], queryFn: () => fetchSubcategories(selectedCategory), enabled: !!selectedCategory });
    const { data: productsBySubcat, isLoading: loadingProductsBySubcat, error: errorProductsBySubcat } = useQuery({ queryKey: ['products', selectedSubcategory], queryFn: () => fetchProducts(selectedSubcategory), enabled: !!selectedSubcategory });
    const { data: productsByCategory, isLoading: loadingProductsByCategory, error: errorProductsByCategory } = useQuery({ queryKey: ['productsByCategory', selectedCategory], queryFn: () => fetchProductsByCategory(selectedCategory), enabled: !!selectedCategory && !selectedSubcategory });
    const { data: allProducts, isLoading: loadingAllProducts, error: errorAllProducts } = useQuery({ queryKey: ['allProducts'], queryFn: fetchAllProducts, enabled: !search && !selectedCategory && !selectedSubcategory });
    const unaccent = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const productsToShow = (() => {
        if (search.trim() !== '') {
            if (globalSearchResults)
                return globalSearchResults;
            const base = selectedSubcategory ? productsBySubcat : selectedCategory ? productsByCategory : allProducts;
            return (base || []).filter(p => unaccent(p.nombre_articulo.toLowerCase()).includes(unaccent(search.toLowerCase())));
        }
        if (selectedSubcategory)
            return productsBySubcat;
        if (selectedCategory)
            return productsByCategory;
        return allProducts;
    })() || [];
    const filteredProducts = productsToShow.filter((prod) => {
        const price = prod.precio_articulo_por_formato_venta_articulo || 0;
        const matchesMin = minPrice === '' || price >= parseFloat(minPrice);
        const matchesMax = maxPrice === '' || price <= parseFloat(maxPrice);
        return matchesMin && matchesMax;
    });
    const addProduct = (product) => {
        setSelectedProducts(prev => {
            const exist = prev.find(p => p.id_articulo === product.id_articulo);
            if (exist) {
                return prev.map(p => p.id_articulo === product.id_articulo ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p);
            }
            return [...prev, { ...product, cantidad: 1 }];
        });
    };
    const removeOneProduct = (product) => {
        setSelectedProducts(prev => {
            const exist = prev.find(p => p.id_articulo === product.id_articulo);
            if (exist && exist.cantidad && exist.cantidad > 1) {
                return prev.map(p => p.id_articulo === product.id_articulo ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p);
            }
            return prev.filter(p => p.id_articulo !== product.id_articulo);
        });
    };
    const removeProduct = (product) => {
        setSelectedProducts(prev => prev.filter(p => p.id_articulo !== product.id_articulo));
    };
    const clearSelection = () => setSelectedProducts([]);
    const totalPrice = selectedProducts.reduce((acc, prod) => acc + (prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1), 0);
    const totalUnits = selectedProducts.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);
    const isLoading = loadingAllProducts || loadingProductsByCategory || loadingProductsBySubcat || loadingGlobalSearch || loadingCategories || loadingSubcategories;
    const isError = errorAllProducts || errorProductsByCategory || errorProductsBySubcat || errorGlobalSearch || errorCategories || errorSubcategories;
    // Utilidad para detectar móvil (puedes mejorarla si usas un hook de breakpoint)
    const isMobile = window.innerWidth < 640;
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8", children: _jsxs("div", { className: "max-w-screen-xl mx-auto", children: [_jsxs("header", { className: "mb-6 sticky top-0 z-40 bg-gray-50 pt-4 pb-2 shadow-sm", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-primary mb-2", children: "Cat\u00E1logo de Productos" }), _jsx("p", { className: "text-md md:text-lg text-gray-600", children: "Encuentra todo lo que necesitas para tu compra." })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-16 z-30", children: [_jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "w-full md:hidden flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-4 text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary", "aria-expanded": showFilters, "aria-controls": "filters-panel", children: [_jsx("span", { children: showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }), showFilters ? _jsx(XIcon, { className: "w-6 h-6" }) : _jsx(FilterIcon, { className: "w-6 h-6" })] }), _jsxs("div", { id: "filters-panel", className: `${showFilters ? 'block' : 'hidden'} md:block`, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("label", { htmlFor: "search", className: "block text-base font-medium text-gray-700 mb-1", children: "Buscar por nombre" }), _jsx("input", { type: "text", id: "search", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Ej: Aceite de Girasol...", className: "w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg", onKeyDown: isMobile ? (e => { if (e.key === 'Enter')
                                                        setShowFilters(false); }) : undefined, onBlur: isMobile ? (() => setShowFilters(false)) : undefined })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "minPrice", className: "block text-base font-medium text-gray-700 mb-1", children: "Precio M\u00EDn." }), _jsx("input", { type: "number", id: "minPrice", value: minPrice, onChange: (e) => setMinPrice(e.target.value), placeholder: "0", className: "w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg", onKeyDown: isMobile ? (e => { if (e.key === 'Enter')
                                                        setShowFilters(false); }) : undefined, onBlur: isMobile ? (() => setShowFilters(false)) : undefined })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "maxPrice", className: "block text-base font-medium text-gray-700 mb-1", children: "Precio M\u00E1x." }), _jsx("input", { type: "number", id: "maxPrice", value: maxPrice, onChange: (e) => setMaxPrice(e.target.value), placeholder: "100", className: "w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg", onKeyDown: isMobile ? (e => { if (e.key === 'Enter')
                                                        setShowFilters(false); }) : undefined, onBlur: isMobile ? (() => setShowFilters(false)) : undefined })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "category", className: "block text-base font-medium text-gray-700 mb-1", children: "Categor\u00EDa" }), _jsx(Listbox, { value: selectedCategory, onChange: (v) => { setSelectedCategory(v); setSelectedSubcategory(''); }, children: _jsxs("div", { className: "relative", children: [_jsxs(ListboxButton, { className: "w-full rounded-lg border px-4 py-3 text-left bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between", onClick: isMobile ? (e) => { e.preventDefault(); setIsCategoryModalOpen(true); } : undefined, children: [_jsx("span", { children: selectedCategory ? ((categories || []).find(cat => String(cat.id) === selectedCategory)?.nombre) : 'Todas las categorías' }), _jsx(ChevronUpDownIcon, { className: "w-5 h-5 text-gray-400 ml-2" })] }), isMobile && isCategoryModalOpen ? (_jsx(Transition, { appear: true, show: isCategoryModalOpen, as: Fragment, children: _jsx(Dialog, { as: Fragment, onClose: () => setIsCategoryModalOpen(false), children: _jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40", "aria-hidden": "true" }), _jsxs("div", { className: "relative bg-white rounded-t-2xl w-full max-w-md mx-auto mt-auto pb-8 pt-4 px-4 animate-fade-in", children: [_jsx(Dialog.Title, { className: "text-lg font-bold mb-4 text-center", children: "Selecciona una categor\u00EDa" }), _jsxs("div", { className: "flex flex-col gap-2 max-h-[60vh] overflow-y-auto", children: [_jsx("button", { className: "text-left px-4 py-3 rounded-lg hover:bg-primary/10", onClick: () => { setSelectedCategory(''); setIsCategoryModalOpen(false); if (isMobile)
                                                                                                    setShowFilters(false); }, children: "Todas las categor\u00EDas" }), categories?.map((cat) => (_jsx("button", { className: "text-left px-4 py-3 rounded-lg hover:bg-primary/10", onClick: () => { setSelectedCategory(String(cat.id)); setIsCategoryModalOpen(false); if (isMobile)
                                                                                                    setShowFilters(false); }, children: cat.nombre }, cat.id)))] }), _jsx("button", { className: "mt-6 w-full py-3 rounded-lg bg-gray-200 text-primary font-semibold hover:bg-gray-300", onClick: () => setIsCategoryModalOpen(false), children: "Cerrar" })] })] }) }) })) : (_jsxs(ListboxOptions, { className: "absolute mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-50", children: [_jsx(ListboxOption, { value: '', className: ({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`, children: "Todas las categor\u00EDas" }), categories?.map((cat) => (_jsx(ListboxOption, { value: String(cat.id), className: ({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`, children: cat.nombre }, cat.id)))] }))] }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subcategory", className: "block text-base font-medium text-gray-700 mb-1", children: "Subcategor\u00EDa" }), _jsx(Listbox, { value: selectedSubcategory, onChange: (v) => setSelectedSubcategory(v), disabled: !selectedCategory || loadingSubcategories, children: _jsxs("div", { className: "relative", children: [_jsxs(ListboxButton, { className: "w-full rounded-lg border px-4 py-3 text-left bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:bg-gray-100 disabled:text-gray-400", disabled: !selectedCategory || loadingSubcategories, onClick: isMobile ? (e) => { e.preventDefault(); setIsSubcategoryModalOpen(true); } : undefined, children: [_jsx("span", { children: selectedSubcategory ? (subcategories?.find(sub => String(sub.id) === selectedSubcategory)?.nombre) : (loadingSubcategories ? 'Cargando...' : 'Todas las subcategorías') }), _jsx(ChevronUpDownIcon, { className: "w-5 h-5 text-gray-400 ml-2" })] }), isMobile && isSubcategoryModalOpen ? (_jsx(Transition, { appear: true, show: isSubcategoryModalOpen, as: Fragment, children: _jsx(Dialog, { as: Fragment, onClose: () => setIsSubcategoryModalOpen(false), children: _jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40", "aria-hidden": "true" }), _jsxs("div", { className: "relative bg-white rounded-t-2xl w-full max-w-md mx-auto mt-auto pb-8 pt-4 px-4 animate-fade-in", children: [_jsx(Dialog.Title, { className: "text-lg font-bold mb-4 text-center", children: "Selecciona una subcategor\u00EDa" }), _jsxs("div", { className: "flex flex-col gap-2 max-h-[60vh] overflow-y-auto", children: [_jsx("button", { className: "text-left px-4 py-3 rounded-lg hover:bg-primary/10", onClick: () => { setSelectedSubcategory(''); setIsSubcategoryModalOpen(false); if (isMobile)
                                                                                                    setShowFilters(false); }, children: "Todas las subcategor\u00EDas" }), subcategories?.map((sub) => (_jsx("button", { className: "text-left px-4 py-3 rounded-lg hover:bg-primary/10", onClick: () => { setSelectedSubcategory(String(sub.id)); setIsSubcategoryModalOpen(false); if (isMobile)
                                                                                                    setShowFilters(false); }, children: sub.nombre }, sub.id)))] }), _jsx("button", { className: "mt-6 w-full py-3 rounded-lg bg-gray-200 text-primary font-semibold hover:bg-gray-300", onClick: () => setIsSubcategoryModalOpen(false), children: "Cerrar" })] })] }) }) })) : (_jsxs(ListboxOptions, { className: "absolute mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-50", children: [_jsx(ListboxOption, { value: '', className: ({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`, children: "Todas las subcategor\u00EDas" }), subcategories?.map((sub) => (_jsx(ListboxOption, { value: String(sub.id), className: ({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-primary/10' : ''}`, children: sub.nombre }, sub.id)))] }))] }) })] })] })] })] }), isLoading && _jsx("div", { className: "text-center py-10 text-gray-500", children: "Cargando..." }), isError && _jsx("div", { className: "text-center py-10 text-red-500", children: "Error al cargar los datos. Por favor, int\u00E9ntalo de nuevo." }), !isLoading && !isError && filteredProducts.length === 0 && _jsx("div", { className: "text-center py-10 text-gray-500", children: "No se encontraron productos con los filtros aplicados." }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8", children: filteredProducts.map((product) => (_jsx(ProductCard, { product: product, isSelected: selectedProducts.some(p => p.id_articulo === product.id_articulo), onAdd: addProduct, onRemove: removeOneProduct }, product.id_articulo))) }), selectedProducts.length > 0 && (_jsxs("div", { className: "fixed bottom-0 left-0 w-full z-50 bg-white border-t border-accent shadow-lg px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-4 w-full sm:w-auto", children: [_jsxs("span", { className: "font-semibold text-primary text-base sm:text-lg", children: ["\uD83D\uDED2 ", totalUnits, " ", totalUnits > 1 ? 'productos' : 'producto'] }), _jsxs("span", { className: "font-semibold text-accent text-base sm:text-lg", children: ["Total: ", totalPrice.toFixed(2), " \u20AC"] })] }), _jsxs("div", { className: "flex flex-row gap-2 w-full sm:w-auto justify-center", children: [_jsx("button", { className: "bg-cyan-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-cyan-700 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400", onClick: () => setShowSelectionModal(true), children: "Ver selecci\u00F3n" }), _jsx("button", { className: "bg-gray-200 text-primary px-3 py-1.5 rounded-md shadow hover:bg-gray-300 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary", onClick: clearSelection, children: "Limpiar" }), _jsx("button", { className: "bg-accent text-white px-3 py-1.5 rounded-md shadow hover:bg-accent/80 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent", onClick: () => { localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts)); window.location.href = '/lista'; }, children: "Generar lista" })] })] })), showSelectionModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", onClick: () => setShowSelectionModal(false), children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative animate-fade-in mx-4", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "absolute top-3 right-3 text-gray-400 hover:text-gray-700", onClick: () => setShowSelectionModal(false), "aria-label": "Cerrar", children: _jsx(XIcon, { className: "w-6 h-6" }) }), _jsx("h3", { className: "text-xl font-bold mb-4 text-primary flex items-center gap-2", children: "\uD83D\uDED2 Productos seleccionados" }), selectedProducts.length === 0 ? (_jsx("div", { className: "text-gray-500 text-center py-8", children: "No hay productos seleccionados." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "divide-y divide-gray-200 max-h-[60vh] overflow-y-auto mb-4 pr-2", children: selectedProducts.map((prod) => (_jsxs("li", { className: "flex items-center gap-3 py-3", children: [_jsx("img", { src: prod.imagen_articulo, alt: prod.nombre_articulo, className: "w-14 h-14 object-contain rounded-md flex-shrink-0", loading: "lazy" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-semibold text-primary text-base truncate", children: prod.nombre_articulo }), _jsxs("div", { className: "text-sm text-gray-600", children: [prod.precio_articulo_por_formato_venta_articulo?.toFixed(2), " \u20AC"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition flex-shrink-0", onClick: () => removeOneProduct(prod), "aria-label": `Quitar uno de ${prod.nombre_articulo}`, children: "-" }), _jsx("span", { className: "font-bold text-lg text-primary w-8 text-center", children: prod.cantidad || 1 }), _jsx("button", { className: "bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-green-600 transition flex-shrink-0", onClick: () => addProduct(prod), "aria-label": `Añadir uno de ${prod.nombre_articulo}`, children: "+" })] }), _jsx("button", { className: "ml-2 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 transition flex-shrink-0", onClick: () => removeProduct(prod), "aria-label": `Eliminar ${prod.nombre_articulo} de la lista`, children: _jsx(XIcon, { className: "w-5 h-5" }) })] }, prod.id_articulo))) }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t", children: [_jsx("button", { className: "px-5 py-2 rounded-lg bg-gray-200 text-primary hover:bg-gray-300 transition", onClick: clearSelection, children: "Limpiar selecci\u00F3n" }), _jsx("button", { className: "px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition", onClick: () => { localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts)); window.location.href = '/lista'; }, children: "Generar lista" })] })] }))] }) }))] }) }));
};
export default Productos;
