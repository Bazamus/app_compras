import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const listasMock = [
    {
        id: 1,
        nombre: 'Semana 1',
        dias: 7,
        personas: 3,
        presupuesto: 60,
        fecha: '2025-07-05',
        productos: ['Leche', 'Pan', 'Huevos', 'Pollo', 'Verdura'],
        menus: [
            { dia: 'Lunes', desayuno: 'Café y tostadas', comida: 'Pollo al horno', cena: 'Ensalada' },
            { dia: 'Martes', desayuno: 'Fruta', comida: 'Pasta', cena: 'Sopa' },
            // ...
        ],
    },
    {
        id: 2,
        nombre: 'Semana 2',
        dias: 5,
        personas: 2,
        presupuesto: 40,
        fecha: '2025-07-12',
        productos: ['Yogur', 'Arroz', 'Pescado', 'Verdura'],
        menus: [
            { dia: 'Lunes', desayuno: 'Yogur', comida: 'Arroz con verduras', cena: 'Pescado' },
            // ...
        ],
    },
];
const Historial = () => {
    const [listas, setListas] = useState(listasMock);
    const [detalle, setDetalle] = useState(null);
    const eliminarLista = (id) => {
        if (window.confirm('¿Seguro que quieres eliminar esta lista?')) {
            setListas(listas.filter(l => l.id !== id));
            setDetalle(null);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center", children: [_jsxs("div", { className: "w-full max-w-3xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-primary", children: "\uD83D\uDDC2\uFE0F Tus Listas y Men\u00FAs Generados" }), _jsx("a", { href: "/", className: "btn bg-accent text-white px-4 py-2 rounded shadow hover:bg-accent/80", children: "+ Nueva lista/men\u00FA" })] }), _jsxs("div", { className: "space-y-6", children: [listas.length === 0 && (_jsx("div", { className: "text-center text-gray-500", children: "No tienes listas guardadas todav\u00EDa." })), listas.map(lista => (_jsxs("div", { className: "bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "font-semibold text-lg text-secondary", children: ["\uD83D\uDCC5 ", lista.nombre, " (", lista.dias, " d\u00EDas) - ", lista.personas, " personas"] }), _jsxs("div", { className: "text-gray-500 text-sm", children: ["Presupuesto: ", _jsxs("b", { children: [lista.presupuesto, " \u20AC"] }), " | Generada: ", lista.fecha] }), _jsxs("div", { className: "mt-2 text-sm text-gray-700", children: ["Productos: ", lista.productos.join(', ')] })] }), _jsxs("div", { className: "flex gap-2 mt-2 md:mt-0", children: [_jsx("button", { className: "btn bg-primary text-white px-3 py-1 rounded", onClick: () => setDetalle(lista), children: "Ver detalles" }), _jsx("button", { className: "btn bg-secondary text-white px-3 py-1 rounded", onClick: () => alert('Función de edición próximamente'), children: "Editar" }), _jsx("button", { className: "btn bg-red-500 text-white px-3 py-1 rounded", onClick: () => eliminarLista(lista.id), children: "Eliminar" })] })] }, lista.id)))] })] }), detalle && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fade-in", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl", onClick: () => setDetalle(null), children: "\u00D7" }), _jsxs("h2", { className: "text-xl font-bold mb-2 text-primary", children: [detalle.nombre, " (", detalle.dias, " d\u00EDas)"] }), _jsxs("div", { className: "mb-2 text-gray-600", children: ["Personas: ", detalle.personas, " | Presupuesto: ", detalle.presupuesto, " \u20AC | Fecha: ", detalle.fecha] }), _jsxs("div", { className: "mb-4", children: [_jsx("b", { children: "Productos:" }), " ", detalle.productos.join(', ')] }), _jsxs("div", { children: [_jsx("b", { children: "Men\u00FAs diarios:" }), _jsx("ul", { className: "list-disc ml-6 mt-2 space-y-1", children: detalle.menus.map((m, i) => (_jsxs("li", { children: [_jsxs("b", { children: [m.dia, ":"] }), " Desayuno: ", m.desayuno, ", Comida: ", m.comida, ", Cena: ", m.cena] }, i))) })] }), _jsxs("div", { className: "mt-6 flex gap-2 justify-end", children: [_jsx("button", { className: "btn bg-secondary text-white px-4 py-2 rounded", onClick: () => alert('Función de exportar próximamente'), children: "Exportar" }), _jsx("button", { className: "btn bg-gray-200 text-gray-700 px-4 py-2 rounded", onClick: () => setDetalle(null), children: "Cerrar" })] })] }) }))] }));
};
export default Historial;
