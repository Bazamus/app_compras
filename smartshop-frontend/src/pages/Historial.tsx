import React, { useState } from 'react';

interface ListaMenu {
  id: number;
  nombre: string;
  dias: number;
  personas: number;
  presupuesto: number;
  fecha: string;
  productos: string[];
  menus: { dia: string; desayuno: string; comida: string; cena: string }[];
}

const listasMock: ListaMenu[] = [
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

const Historial: React.FC = () => {
  const [listas, setListas] = useState(listasMock);
  const [detalle, setDetalle] = useState<ListaMenu | null>(null);

  const eliminarLista = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar esta lista?')) {
      setListas(listas.filter(l => l.id !== id));
      setDetalle(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">🗂️ Tus Listas y Menús Generados</h1>
          <a href="/" className="btn bg-accent text-white px-4 py-2 rounded shadow hover:bg-accent/80">+ Nueva lista/menú</a>
        </div>
        <div className="space-y-6">
          {listas.length === 0 && (
            <div className="text-center text-gray-500">No tienes listas guardadas todavía.</div>
          )}
          {listas.map(lista => (
            <div key={lista.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-semibold text-lg text-secondary">📅 {lista.nombre} ({lista.dias} días) - {lista.personas} personas</div>
                <div className="text-gray-500 text-sm">Presupuesto: <b>{lista.presupuesto} €</b> | Generada: {lista.fecha}</div>
                <div className="mt-2 text-sm text-gray-700">Productos: {lista.productos.join(', ')}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="btn bg-primary text-white px-3 py-1 rounded" onClick={() => setDetalle(lista)}>Ver detalles</button>
                <button className="btn bg-secondary text-white px-3 py-1 rounded" onClick={() => alert('Función de edición próximamente')}>Editar</button>
                <button className="btn bg-red-500 text-white px-3 py-1 rounded" onClick={() => eliminarLista(lista.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal de detalles */}
      {detalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setDetalle(null)}>×</button>
            <h2 className="text-xl font-bold mb-2 text-primary">{detalle.nombre} ({detalle.dias} días)</h2>
            <div className="mb-2 text-gray-600">Personas: {detalle.personas} | Presupuesto: {detalle.presupuesto} € | Fecha: {detalle.fecha}</div>
            <div className="mb-4">
              <b>Productos:</b> {detalle.productos.join(', ')}
            </div>
            <div>
              <b>Menús diarios:</b>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                {detalle.menus.map((m, i) => (
                  <li key={i}>
                    <b>{m.dia}:</b> Desayuno: {m.desayuno}, Comida: {m.comida}, Cena: {m.cena}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex gap-2 justify-end">
              <button className="btn bg-secondary text-white px-4 py-2 rounded" onClick={() => alert('Función de exportar próximamente')}>Exportar</button>
              <button className="btn bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historial; 