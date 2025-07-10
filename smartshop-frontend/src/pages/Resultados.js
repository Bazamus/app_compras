import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const Resultados = () => {
    const [listas, setListas] = useState([]);
    const [detalleLista, setDetalleLista] = useState(null);
    const [deleteMsg, setDeleteMsg] = useState('');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameIdx, setRenameIdx] = useState(null);
    const [tempRename, setTempRename] = useState('');
    const [renameMsg, setRenameMsg] = useState('');
    useEffect(() => {
        const loadLists = () => {
            const saved = JSON.parse(localStorage.getItem('savedLists') || '[]');
            setListas(saved);
        };
        loadLists();
        window.addEventListener('focus', loadLists);
        return () => window.removeEventListener('focus', loadLists);
    }, []);
    const eliminarLista = (idx) => {
        if (!window.confirm('¿Eliminar esta lista?'))
            return;
        const nuevas = listas.filter((_, i) => i !== idx);
        setListas(nuevas);
        localStorage.setItem('savedLists', JSON.stringify(nuevas));
        setDeleteMsg('Lista eliminada correctamente');
        setTimeout(() => setDeleteMsg(''), 2000);
    };
    const verLista = (idx) => {
        // Sobrescribe la selección actual y navega a /lista
        localStorage.setItem('selectedProducts', JSON.stringify(listas[idx].productos));
        localStorage.setItem('selectedListName', listas[idx].nombre);
        window.location.href = '/lista';
    };
    const renombrarLista = (idx) => {
        setTempRename(listas[idx].nombre);
        setRenameIdx(idx);
        setShowRenameModal(true);
    };
    const guardarRenombrar = () => {
        if (renameIdx === null || !tempRename.trim())
            return;
        const nuevas = listas.map((l, i) => i === renameIdx ? { ...l, nombre: tempRename.trim() } : l);
        setListas(nuevas);
        localStorage.setItem('savedLists', JSON.stringify(nuevas));
        setShowRenameModal(false);
        setRenameMsg('¡Lista renombrada correctamente!');
        setTimeout(() => setRenameMsg(''), 2000);
    };
    return (_jsxs("div", { className: "p-8 max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Listas guardadas" }), deleteMsg && _jsx("div", { className: "mb-4 text-green-700 font-semibold text-center", children: deleteMsg }), listas.length === 0 ? (_jsx("p", { className: "text-lg text-center text-gray-500", children: "No hay listas guardadas." })) : (_jsx("ul", { className: "space-y-4", children: listas.map((lista, idx) => (_jsxs("li", { className: "bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-primary text-lg cursor-pointer hover:underline", onClick: () => setDetalleLista(lista), children: lista.nombre }), _jsx("div", { className: "text-xs text-gray-500 mb-1", children: new Date(lista.fecha).toLocaleString() }), _jsxs("div", { className: "text-sm text-gray-700", children: ["Productos: ", lista.productos.length] })] }), _jsxs("div", { className: "flex gap-2 mt-2 md:mt-0", children: [_jsx("button", { className: "px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition font-semibold shadow", onClick: () => verLista(idx), children: "Ver lista" }), _jsx("button", { className: "px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition font-semibold shadow", onClick: () => setDetalleLista(lista), children: "Ver detalles" }), _jsx("button", { className: "px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition font-semibold shadow", onClick: () => renombrarLista(idx), children: "Renombrar" }), _jsx("button", { className: "px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition font-semibold shadow", onClick: () => eliminarLista(idx), children: "Eliminar" })] })] }, idx))) })), detalleLista && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative animate-fade-in", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold", onClick: () => setDetalleLista(null), "aria-label": "Cerrar", children: "\u00D7" }), _jsxs("h3", { className: "text-xl font-bold mb-4 text-primary flex items-center gap-2", children: ["\uD83D\uDCDD Productos de \"", detalleLista.nombre, "\""] }), _jsx("ul", { className: "divide-y divide-gray-200 max-h-80 overflow-y-auto mb-4", children: detalleLista.productos.map((prod, i) => (_jsxs("li", { className: "flex items-center gap-3 py-2", children: [_jsx("img", { src: prod.imagen_articulo, alt: prod.nombre_articulo, className: "w-10 h-10 object-contain rounded" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold text-primary text-sm", children: prod.nombre_articulo }), _jsxs("div", { className: "text-xs text-gray-500", children: [prod.cantidad, " uds \u00B7 ", prod.precio_articulo_por_formato_venta_articulo?.toFixed(2), " \u20AC"] })] })] }, prod.id_articulo + i))) }), _jsx("div", { className: "flex justify-end gap-4", children: _jsx("button", { className: "px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition", onClick: () => setDetalleLista(null), children: "Cerrar" }) })] }) })), showRenameModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold", onClick: () => setShowRenameModal(false), "aria-label": "Cerrar", children: "\u00D7" }), _jsx("h3", { className: "text-lg font-bold mb-4 text-primary", children: "Nuevo nombre para la lista" }), _jsx("input", { type: "text", className: "w-full border rounded px-3 py-2 mb-4", placeholder: "Ej: Compra semanal", value: tempRename, onChange: e => setTempRename(e.target.value), autoFocus: true }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { className: "px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition", onClick: () => setShowRenameModal(false), children: "Cancelar" }), _jsx("button", { className: "px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition font-semibold", onClick: guardarRenombrar, children: "Renombrar" })] })] }) })), renameMsg && (_jsx("div", { className: "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-yellow-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in", children: renameMsg })), _jsxs("div", { className: "flex justify-center mt-8 gap-4", children: [_jsx("a", { href: "/", className: "px-4 py-2 rounded bg-accent text-white hover:bg-accent/80 transition font-semibold shadow", children: "Inicio" }), _jsx("a", { href: "/productos", className: "px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition font-semibold shadow", children: "Explorar productos" })] })] }));
};
export default Resultados;
