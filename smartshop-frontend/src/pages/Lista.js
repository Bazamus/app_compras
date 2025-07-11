import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const Lista = () => {
    const [productos, setProductos] = useState([]);
    const [checklistMode, setChecklistMode] = useState(() => {
        const stored = localStorage.getItem('checklistMode');
        return stored ? JSON.parse(stored) : false;
    });
    const [checked, setChecked] = useState(() => {
        const stored = localStorage.getItem('checkedProducts');
        return stored ? JSON.parse(stored) : {};
    });
    const [saveMsg, setSaveMsg] = useState('');
    const [listName, setListName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [tempName, setTempName] = useState('');
    useEffect(() => {
        const stored = localStorage.getItem('selectedProducts');
        if (stored) {
            setProductos(JSON.parse(stored));
        }
        const storedName = localStorage.getItem('selectedListName');
        setListName(storedName || '');
    }, []);
    useEffect(() => {
        localStorage.setItem('checklistMode', JSON.stringify(checklistMode));
    }, [checklistMode]);
    useEffect(() => {
        localStorage.setItem('checkedProducts', JSON.stringify(checked));
    }, [checked]);
    const total = productos.reduce((acc, prod) => acc + (prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1), 0);
    // Modificar cantidad de un producto
    const addUnit = (id) => {
        setProductos(prev => {
            const updated = prev.map(p => p.id_articulo === id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p);
            localStorage.setItem('selectedProducts', JSON.stringify(updated));
            return updated;
        });
    };
    const removeUnit = (id) => {
        setProductos(prev => {
            const updated = prev
                .map(p => p.id_articulo === id ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p)
                .filter((p) => p.cantidad > 0);
            localStorage.setItem('selectedProducts', JSON.stringify(updated));
            return updated;
        });
    };
    const removeProduct = (id) => {
        setProductos(prev => {
            const updated = prev.filter((p) => p.id_articulo !== id);
            localStorage.setItem('selectedProducts', JSON.stringify(updated));
            return updated;
        });
    };
    const toggleCheck = (id) => {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const exportPDF = async () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Lista de la compra', 14, 18);
        // Guardar imágenes base64 por fila
        const images = [];
        const tableData = await Promise.all(productos.map(async (prod) => {
            let imgData = '';
            if (prod.imagen_articulo) {
                try {
                    const res = await fetch(prod.imagen_articulo);
                    const blob = await res.blob();
                    imgData = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
                catch {
                    imgData = '';
                }
            }
            images.push(imgData);
            return [
                '', // La celda de imagen queda vacía, solo se usará addImage
                prod.nombre_articulo,
                prod.cantidad,
                (prod.precio_articulo_por_formato_venta_articulo || 0).toFixed(2) + ' €',
                ((prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1)).toFixed(2) + ' €',
            ];
        }));
        autoTable(doc, {
            head: [["Foto", "Producto", "Uds", "Precio", "Subtotal"]],
            body: tableData,
            startY: 24,
            didDrawCell: (data) => {
                if (data.column.index === 0 && data.cell.section === 'body') {
                    const img = images[data.row.index];
                    if (img) {
                        doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 12, 12);
                    }
                }
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.row.index !== undefined && data.column.index === 0) {
                    data.cell.styles.minCellHeight = 16;
                }
            },
            columnStyles: {
                0: { cellWidth: 16 },
                1: { cellWidth: 60 },
                2: { cellWidth: 18, halign: 'center' },
                3: { cellWidth: 22, halign: 'right' },
                4: { cellWidth: 26, halign: 'right' },
            },
            styles: { fontSize: 10, cellPadding: 4 },
            headStyles: { fillColor: [44, 62, 80] },
        });
        // Total
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(12);
        doc.text(`Total: ${total.toFixed(2)} €`, 150, finalY + 10, { align: 'right' });
        doc.save('lista-compra.pdf');
    };
    const saveList = () => {
        let nombre = listName;
        let isNew = false;
        if (!nombre) {
            setTempName('');
            setShowNameModal(true);
            return;
        }
        guardarLista(nombre, isNew);
    };
    const guardarLista = (nombre, isNew) => {
        const savedLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
        const nuevaLista = {
            nombre,
            fecha: new Date().toISOString(),
            productos,
        };
        let nuevasListas;
        if (isNew) {
            nuevasListas = [...savedLists, nuevaLista];
        }
        else {
            const idx = savedLists.findIndex((l) => l.nombre === nombre);
            if (idx !== -1) {
                savedLists[idx] = nuevaLista;
                nuevasListas = savedLists;
            }
            else {
                nuevasListas = [...savedLists, nuevaLista];
            }
        }
        localStorage.setItem('savedLists', JSON.stringify(nuevasListas));
        setSaveMsg(isNew ? '¡Lista guardada correctamente!' : '¡Lista actualizada!');
        setTimeout(() => setSaveMsg(''), 2500);
        if (isNew) {
            setListName(nombre);
            localStorage.setItem('selectedListName', nombre);
        }
        setShowNameModal(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center", children: [_jsxs("div", { className: "w-full max-w-3xl bg-white rounded-xl shadow p-6", children: [_jsxs("h1", { className: "text-2xl font-bold text-primary mb-6", children: ["\uD83D\uDCDD ", listName ? listName : 'Tu lista de la compra'] }), productos.length === 0 ? (_jsx("div", { className: "text-gray-500 text-center py-8", children: "No hay productos en la lista." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex flex-col gap-4 md:hidden", children: productos.map((prod) => (_jsxs("div", { className: `bg-white rounded-lg shadow p-4 flex gap-4 items-center ${checklistMode && checked[prod.id_articulo] ? 'opacity-50 line-through' : ''}`, children: [checklistMode && (_jsx("input", { type: "checkbox", checked: !!checked[prod.id_articulo], onChange: () => toggleCheck(prod.id_articulo), className: "w-6 h-6 accent-green-500 mr-2" })), _jsx("img", { src: prod.imagen_articulo, alt: prod.nombre_articulo, className: "w-14 h-14 object-contain rounded" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold text-primary break-words", children: prod.nombre_articulo }), _jsxs("div", { className: "text-xs text-gray-500", children: [prod.formato_venta_articulo, " ", prod.cantidad_unidad_medida_articulo, " ", prod.unidad_medida_articulo] }), _jsxs("div", { className: "text-sm text-gray-700", children: [prod.precio_articulo_por_formato_venta_articulo?.toFixed(2), " \u20AC"] })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => removeUnit(prod.id_articulo), className: "w-10 h-10 bg-red-500 text-white rounded text-lg flex items-center justify-center", children: "-" }), _jsx("span", { className: "text-lg font-bold", children: prod.cantidad }), _jsx("button", { onClick: () => addUnit(prod.id_articulo), className: "w-10 h-10 bg-green-500 text-white rounded text-lg flex items-center justify-center", children: "+" })] }), _jsx("button", { onClick: () => removeProduct(prod.id_articulo), className: "w-10 h-10 bg-gray-300 text-gray-700 rounded text-lg flex items-center justify-center mt-2", children: "\uD83D\uDDD1\uFE0F" })] })] }, prod.id_articulo))) }), _jsxs("table", { className: "w-full mb-6 hidden md:table", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [checklistMode && _jsx("th", { className: "py-2 px-2 w-8" }), _jsx("th", { className: "py-2 px-4 text-left w-20", children: "Foto" }), _jsx("th", { className: "py-2 px-4 text-left w-2/5", children: "Producto" }), _jsx("th", { className: "py-2 px-4 text-center w-32", children: "Unidades" }), _jsx("th", { className: "py-2 px-4 text-right w-24", children: "Precio" }), _jsx("th", { className: "py-2 px-4 text-right w-28", children: "Subtotal" }), _jsx("th", { className: "py-2 px-4 text-center w-32", children: "Acciones" })] }) }), _jsx("tbody", { children: productos.map((prod) => (_jsxs("tr", { className: `border-b hover:bg-gray-50 transition ${checklistMode && checked[prod.id_articulo] ? 'opacity-50 line-through' : ''}`, children: [checklistMode && (_jsx("td", { className: "py-2 px-2 text-center align-middle", children: _jsx("input", { type: "checkbox", checked: !!checked[prod.id_articulo], onChange: () => toggleCheck(prod.id_articulo), className: "w-5 h-5 accent-green-500" }) })), _jsx("td", { className: "py-2 px-4", children: _jsx("img", { src: prod.imagen_articulo, alt: prod.nombre_articulo, className: "w-14 h-14 object-contain rounded" }) }), _jsxs("td", { className: "py-2 px-4 align-top", children: [_jsx("div", { className: "font-semibold text-primary break-words", children: prod.nombre_articulo }), _jsxs("div", { className: "text-xs text-gray-500", children: [prod.formato_venta_articulo, " ", prod.cantidad_unidad_medida_articulo, " ", prod.unidad_medida_articulo] })] }), _jsx("td", { className: "py-2 px-4 text-center font-semibold", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { className: "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600", onClick: () => removeUnit(prod.id_articulo), children: "-" }), _jsx("span", { children: prod.cantidad }), _jsx("button", { className: "bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600", onClick: () => addUnit(prod.id_articulo), children: "+" })] }) }), _jsx("td", { className: "py-2 px-4 text-right whitespace-nowrap align-middle", children: _jsxs("span", { children: [prod.precio_articulo_por_formato_venta_articulo?.toFixed(2), " \u20AC"] }) }), _jsx("td", { className: "py-2 px-4 text-right font-semibold whitespace-nowrap align-middle", children: _jsxs("span", { children: [((prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1)).toFixed(2), " \u20AC"] }) }), _jsx("td", { className: "py-2 px-4 text-center", children: _jsx("button", { className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600", onClick: () => removeProduct(prod.id_articulo), children: "Eliminar" }) })] }, prod.id_articulo))) })] }), _jsxs("div", { className: "fixed bottom-0 left-0 w-full z-40 bg-white shadow p-4 flex flex-col gap-2 md:hidden border-t", children: [_jsxs("span", { className: "font-bold text-lg text-primary", children: ["Total: ", total.toFixed(2), " \u20AC"] }), _jsxs("div", { className: "flex gap-2 flex-col", children: [_jsx("button", { className: "px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow", onClick: exportPDF, children: "Exportar a PDF" }), _jsx("button", { className: "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition font-semibold shadow", onClick: saveList, children: "Guardar lista" })] })] }), _jsx("div", { className: "h-28 md:hidden" }), _jsxs("div", { className: "mt-8 flex flex-col md:flex-row md:justify-between md:items-start gap-6", children: [_jsxs("div", { className: "order-last md:order-first w-full md:w-auto text-center md:text-left", children: [_jsx("p", { className: "text-lg font-bold text-primary", children: "Total de la compra" }), _jsxs("p", { className: "text-4xl font-bold text-gray-800 tracking-tight", children: [total.toFixed(2), " \u20AC"] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto", children: [_jsx("a", { href: "/productos", className: "w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-cyan-600 text-white hover:bg-cyan-700", children: "+ A\u00F1adir productos" }), _jsx("button", { className: "w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-gray-200 text-gray-800 hover:bg-gray-300", onClick: () => {
                                                    localStorage.removeItem('selectedListName');
                                                    localStorage.removeItem('selectedProducts');
                                                    window.location.href = '/productos';
                                                }, children: "Nueva lista" }), _jsx("button", { className: `w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition ${checklistMode
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'}`, onClick: () => setChecklistMode((m) => !m), children: checklistMode ? 'Salir' : 'Checklist' }), _jsx("button", { className: "w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-indigo-600 text-white hover:bg-indigo-700", onClick: exportPDF, children: "Exportar PDF" }), _jsx("button", { className: "w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-green-600 text-white hover:bg-green-700", onClick: saveList, children: "Guardar lista" }), _jsx("a", { href: "/", className: "w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-cyan-700 text-white hover:bg-cyan-800", children: "Volver" })] })] }), _jsx("div", { className: "h-28 md:hidden" })] }))] }), showNameModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold", onClick: () => setShowNameModal(false), "aria-label": "Cerrar", children: "\u00D7" }), _jsx("h3", { className: "text-lg font-bold mb-4 text-primary", children: "Nombre para la lista" }), _jsx("input", { type: "text", className: "w-full border rounded px-3 py-2 mb-4", placeholder: "Ej: Compra semanal", value: tempName, onChange: e => setTempName(e.target.value), autoFocus: true }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { className: "px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition", onClick: () => setShowNameModal(false), children: "Cancelar" }), _jsx("button", { className: "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition font-semibold", onClick: () => {
                                        if (tempName.trim()) {
                                            guardarLista(tempName.trim(), true);
                                        }
                                    }, children: "Guardar" })] })] }) })), saveMsg && (_jsx("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in", children: saveMsg }))] }));
};
export default Lista;
