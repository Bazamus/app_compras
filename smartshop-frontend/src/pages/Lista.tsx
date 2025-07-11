import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Producto {
  id_articulo: string;
  nombre_articulo: string;
  imagen_articulo: string;
  precio_articulo_por_formato_venta_articulo: number;
  cantidad: number;
  formato_venta_articulo?: string;
  cantidad_unidad_medida_articulo?: string;
  unidad_medida_articulo?: string;
}

const Lista: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [checklistMode, setChecklistMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('checklistMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [checked, setChecked] = useState<{ [id: string]: boolean }>(() => {
    const stored = localStorage.getItem('checkedProducts');
    return stored ? JSON.parse(stored) : {};
  });
  const [saveMsg, setSaveMsg] = useState<string>('');
  const [listName, setListName] = useState<string>('');
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

  const total = productos.reduce(
    (acc, prod) => acc + (prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1),
    0
  );

  // Modificar cantidad de un producto
  const addUnit = (id: string) => {
    setProductos(prev => {
      const updated = prev.map(p =>
        p.id_articulo === id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
      );
      localStorage.setItem('selectedProducts', JSON.stringify(updated));
      return updated;
    });
  };
  const removeUnit = (id: string) => {
    setProductos(prev => {
      const updated = prev
        .map(p =>
          p.id_articulo === id ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p
        )
        .filter((p: any) => p.cantidad > 0);
      localStorage.setItem('selectedProducts', JSON.stringify(updated));
      return updated;
    });
  };
  const removeProduct = (id: string) => {
    setProductos(prev => {
      const updated = prev.filter((p: any) => p.id_articulo !== id);
      localStorage.setItem('selectedProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Lista de la compra', 14, 18);
    // Guardar imágenes base64 por fila
    const images: string[] = [];
    const tableData = await Promise.all(productos.map(async (prod: any) => {
      let imgData = '';
      if (prod.imagen_articulo) {
        try {
          const res = await fetch(prod.imagen_articulo);
          const blob = await res.blob();
          imgData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch {
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
      didDrawCell: data => {
        if (data.column.index === 0 && data.cell.section === 'body') {
          const img = images[data.row.index];
          if (img) {
            doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 12, 12);
          }
        }
      },
      didParseCell: data => {
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
    const finalY = (doc as any).lastAutoTable.finalY || 40;
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

  const guardarLista = (nombre: string, isNew: boolean) => {
    const savedLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
    const nuevaLista = {
      nombre,
      fecha: new Date().toISOString(),
      productos,
    };
    let nuevasListas;
    if (isNew) {
      nuevasListas = [...savedLists, nuevaLista];
    } else {
      const idx = savedLists.findIndex((l: any) => l.nombre === nombre);
      if (idx !== -1) {
        savedLists[idx] = nuevaLista;
        nuevasListas = savedLists;
      } else {
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">
          📝 {listName ? listName : 'Tu lista de la compra'}
        </h1>
        {productos.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No hay productos en la lista.</div>
        ) : (
          <>
            {/* Cards apiladas para móvil */}
            <div className="flex flex-col gap-4 md:hidden">
              {productos.map((prod) => (
                <div key={prod.id_articulo} className={`bg-white rounded-lg shadow p-4 flex gap-4 items-center ${checklistMode && checked[prod.id_articulo] ? 'opacity-50 line-through' : ''}`}>
                  {checklistMode && (
                    <input
                      type="checkbox"
                      checked={!!checked[prod.id_articulo]}
                      onChange={() => toggleCheck(prod.id_articulo)}
                      className="w-6 h-6 accent-green-500 mr-2"
                    />
                  )}
                  <img src={prod.imagen_articulo} alt={prod.nombre_articulo} className="w-14 h-14 object-contain rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-primary break-words">{prod.nombre_articulo}</div>
                    <div className="text-xs text-gray-500">{prod.formato_venta_articulo} {prod.cantidad_unidad_medida_articulo} {prod.unidad_medida_articulo}</div>
                    <div className="text-sm text-gray-700">{prod.precio_articulo_por_formato_venta_articulo?.toFixed(2)} €</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <button onClick={() => removeUnit(prod.id_articulo)} className="w-10 h-10 bg-red-500 text-white rounded text-lg flex items-center justify-center">-</button>
                      <span className="text-lg font-bold">{prod.cantidad}</span>
                      <button onClick={() => addUnit(prod.id_articulo)} className="w-10 h-10 bg-green-500 text-white rounded text-lg flex items-center justify-center">+</button>
                    </div>
                    <button onClick={() => removeProduct(prod.id_articulo)} className="w-10 h-10 bg-gray-300 text-gray-700 rounded text-lg flex items-center justify-center mt-2">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Tabla para escritorio */}
            <table className="w-full mb-6 hidden md:table">
              <thead>
                <tr className="border-b">
                  {checklistMode && <th className="py-2 px-2 w-8"></th>}
                  <th className="py-2 px-4 text-left w-20">Foto</th>
                  <th className="py-2 px-4 text-left w-2/5">Producto</th>
                  <th className="py-2 px-4 text-center w-32">Unidades</th>
                  <th className="py-2 px-4 text-right w-24">Precio</th>
                  <th className="py-2 px-4 text-right w-28">Subtotal</th>
                  <th className="py-2 px-4 text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id_articulo} className={`border-b hover:bg-gray-50 transition ${checklistMode && checked[prod.id_articulo] ? 'opacity-50 line-through' : ''}`}>
                    {checklistMode && (
                      <td className="py-2 px-2 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={!!checked[prod.id_articulo]}
                          onChange={() => toggleCheck(prod.id_articulo)}
                          className="w-5 h-5 accent-green-500"
                        />
                      </td>
                    )}
                    <td className="py-2 px-4">
                      <img src={prod.imagen_articulo} alt={prod.nombre_articulo} className="w-14 h-14 object-contain rounded" />
                    </td>
                    <td className="py-2 px-4 align-top">
                      <div className="font-semibold text-primary break-words">{prod.nombre_articulo}</div>
                      <div className="text-xs text-gray-500">{prod.formato_venta_articulo} {prod.cantidad_unidad_medida_articulo} {prod.unidad_medida_articulo}</div>
                    </td>
                    <td className="py-2 px-4 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => removeUnit(prod.id_articulo)}>-</button>
                        <span>{prod.cantidad}</span>
                        <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={() => addUnit(prod.id_articulo)}>+</button>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right whitespace-nowrap align-middle">
                      <span>{prod.precio_articulo_por_formato_venta_articulo?.toFixed(2)} €</span>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold whitespace-nowrap align-middle">
                      <span>{((prod.precio_articulo_por_formato_venta_articulo || 0) * (prod.cantidad || 1)).toFixed(2)} €</span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => removeProduct(prod.id_articulo)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Barra de acciones fija SOLO en móvil */}
            <div className="fixed bottom-0 left-0 w-full z-40 bg-white shadow p-4 flex flex-col gap-2 md:hidden border-t">
              <span className="font-bold text-lg text-primary">Total: {total.toFixed(2)} €</span>
              <div className="flex gap-2 flex-col">
                <button
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow"
                  onClick={exportPDF}
                >
                  Exportar a PDF
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition font-semibold shadow"
                  onClick={saveList}
                >
                  Guardar lista
                </button>
              </div>
            </div>
            {/* Espaciador solo en móvil */}
            <div className="h-28 md:hidden" />
            {/* Acciones de la lista */}
            <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              {/* Total a la izquierda */}
              <div className="order-last md:order-first w-full md:w-auto text-center md:text-left">
                <p className="text-lg font-bold text-primary">Total de la compra</p>
                <p className="text-4xl font-bold text-gray-800 tracking-tight">{total.toFixed(2)} €</p>
              </div>

              {/* Grid de botones a la derecha */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
                <a
                  href="/productos"
                  className="w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  + Añadir productos
                </a>
                <button
                  className="w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => {
                    localStorage.removeItem('selectedListName');
                    localStorage.removeItem('selectedProducts');
                    window.location.href = '/productos';
                  }}
                >
                  Nueva lista
                </button>
                <button
                  className={`w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition ${
                    checklistMode
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => setChecklistMode((m) => !m)}
                >
                  {checklistMode ? 'Salir' : 'Checklist'}
                </button>
                <button
                  className="w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={exportPDF}
                >
                  Exportar PDF
                </button>
                <button
                  className="w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-green-600 text-white hover:bg-green-700"
                  onClick={saveList}
                >
                  Guardar lista
                </button>
                <a
                  href="/"
                  className="w-full px-4 py-3 h-14 text-base rounded-lg font-semibold shadow text-center flex items-center justify-center transition bg-cyan-700 text-white hover:bg-cyan-800"
                >
                  Volver
                </a>
              </div>
            </div>
            {/* Espaciador solo en móvil */}
            <div className="h-28 md:hidden" />
          </>
        )}
      </div>
      {/* Modal para nombre de lista */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowNameModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-primary">Nombre para la lista</h3>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Ej: Compra semanal"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition"
                onClick={() => setShowNameModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                onClick={() => {
                  if (tempName.trim()) {
                    guardarLista(tempName.trim(), true);
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Snackbar visual de confirmación */}
      {saveMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in">
          {saveMsg}
        </div>
      )}
    </div>
  );
};

export default Lista; 