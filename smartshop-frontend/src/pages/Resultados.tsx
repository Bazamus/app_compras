import { useEffect, useState } from 'react';

interface ListaGuardada {
  nombre: string;
  fecha: string;
  productos: any[];
}

const Resultados = () => {
  const [listas, setListas] = useState<ListaGuardada[]>([]);
  const [detalleLista, setDetalleLista] = useState<ListaGuardada | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIdx, setRenameIdx] = useState<number | null>(null);
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

  const eliminarLista = (idx: number) => {
    if (!window.confirm('¿Eliminar esta lista?')) return;
    const nuevas = listas.filter((_, i) => i !== idx);
    setListas(nuevas);
    localStorage.setItem('savedLists', JSON.stringify(nuevas));
    setDeleteMsg('Lista eliminada correctamente');
    setTimeout(() => setDeleteMsg(''), 2000);
  };

  const verLista = (idx: number) => {
    // Sobrescribe la selección actual y navega a /lista
    localStorage.setItem('selectedProducts', JSON.stringify(listas[idx].productos));
    localStorage.setItem('selectedListName', listas[idx].nombre);
    window.location.href = '/lista';
  };

  const renombrarLista = (idx: number) => {
    setTempRename(listas[idx].nombre);
    setRenameIdx(idx);
    setShowRenameModal(true);
  };

  const guardarRenombrar = () => {
    if (renameIdx === null || !tempRename.trim()) return;
    const nuevas = listas.map((l, i) => i === renameIdx ? { ...l, nombre: tempRename.trim() } : l);
    setListas(nuevas);
    localStorage.setItem('savedLists', JSON.stringify(nuevas));
    setShowRenameModal(false);
    setRenameMsg('¡Lista renombrada correctamente!');
    setTimeout(() => setRenameMsg(''), 2000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Listas guardadas</h1>
      {deleteMsg && <div className="mb-4 text-green-700 font-semibold text-center">{deleteMsg}</div>}
      {listas.length === 0 ? (
        <p className="text-lg text-center text-gray-500">No hay listas guardadas.</p>
      ) : (
        <ul className="space-y-4">
          {listas.map((lista, idx) => (
            <li key={idx} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border">
              <div>
                <div className="font-semibold text-primary text-lg cursor-pointer hover:underline" onClick={() => setDetalleLista(lista)}>{lista.nombre}</div>
                <div className="text-xs text-gray-500 mb-1">{new Date(lista.fecha).toLocaleString()}</div>
                <div className="text-sm text-gray-700">Productos: {lista.productos.length}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition font-semibold shadow"
                  onClick={() => verLista(idx)}
                >
                  Ver lista
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition font-semibold shadow"
                  onClick={() => setDetalleLista(lista)}
                >
                  Ver detalles
                </button>
                <button
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition font-semibold shadow"
                  onClick={() => renombrarLista(idx)}
                >
                  Renombrar
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition font-semibold shadow"
                  onClick={() => eliminarLista(idx)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {detalleLista && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setDetalleLista(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
              📝 Productos de "{detalleLista.nombre}"
            </h3>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto mb-4">
              {detalleLista.productos.map((prod, i) => (
                <li key={prod.id_articulo + i} className="flex items-center gap-3 py-2">
                  <img src={prod.imagen_articulo} alt={prod.nombre_articulo} className="w-10 h-10 object-contain rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-primary text-sm">{prod.nombre_articulo}</div>
                    <div className="text-xs text-gray-500">{prod.cantidad} uds · {prod.precio_articulo_por_formato_venta_articulo?.toFixed(2)} €</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition"
                onClick={() => setDetalleLista(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowRenameModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-primary">Nuevo nombre para la lista</h3>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Ej: Compra semanal"
              value={tempRename}
              onChange={e => setTempRename(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-primary hover:bg-gray-300 transition"
                onClick={() => setShowRenameModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition font-semibold"
                onClick={guardarRenombrar}
              >
                Renombrar
              </button>
            </div>
          </div>
        </div>
      )}
      {renameMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-yellow-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in">
          {renameMsg}
        </div>
      )}
      <div className="flex justify-center mt-8 gap-4">
        <a href="/" className="px-4 py-2 rounded bg-accent text-white hover:bg-accent/80 transition font-semibold shadow">Inicio</a>
        <a href="/productos" className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition font-semibold shadow">Explorar productos</a>
      </div>
    </div>
  );
};

export default Resultados; 