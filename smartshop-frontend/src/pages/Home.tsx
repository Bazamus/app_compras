import React, { useState } from 'react';

// Tipos para los datos del formulario
interface FormData {
  days: number;
  people: number;
  budget: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  basics: string[];
  extras: string[];
  extrasOther: string;
  restrictions: string;
}

const initialFormData: FormData = {
  days: 7,
  people: 1,
  budget: 50,
  breakfast: [],
  lunch: [],
  dinner: [],
  basics: [],
  extras: [],
  extrasOther: '',
  restrictions: '',
};

const foodSuggestions = [
  'Fruta',
  'Café',
  'Pan',
  'Cereales',
  'Leche',
  'Yogur',
  'Huevos',
  'Verdura',
  'Pollo',
  'Pasta',
  'Pescado',
  'Carne',
  'Sopa',
  'Ensalada',
  'Arroz',
  'Queso',
  'Legumbres',
];

const basicsSuggestions = [
  'Leche',
  'Huevos',
  'Pan',
  'Aceite',
  'Sal',
  'Azúcar',
  'Arroz',
  'Pasta',
  'Café',
  'Papel higiénico',
];

const extrasOptions = [
  'Detergente',
  'Papel de cocina',
  'Limpieza',
  'Higiene',
];

const steps = [
  'Días',
  'Personas',
  'Presupuesto',
  'Alimentos habituales',
  'Básicos',
  'Extras',
  'Restricciones',
  'Resumen',
];

function MultiSelect({ label, value, onChange, suggestions }: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions: string[];
}) {
  const [input, setInput] = useState('');
  const addItem = (item: string) => {
    if (item && !value.includes(item)) {
      onChange([...value, item]);
      setInput('');
    }
  };
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <span key={item} className="bg-accent/20 text-accent px-2 py-1 rounded-full text-sm flex items-center gap-1">
            {item}
            <button type="button" onClick={() => onChange(value.filter((i) => i !== item))} className="ml-1 text-xs">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="input input-bordered flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Añadir..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem(input.trim());
            }
          }}
          list={label + '-suggestions'}
        />
        <button type="button" className="btn bg-accent text-white px-4 py-2 rounded" onClick={() => addItem(input.trim())}>Añadir</button>
      </div>
      <datalist id={label + '-suggestions'}>
        {suggestions.map(s => <option key={s} value={s} />)}
      </datalist>
    </div>
  );
}

const Home: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [touched, setTouched] = useState(false);

  // Validaciones básicas por paso
  const isValid = () => {
    switch (step) {
      case 0: return form.days >= 1 && form.days <= 30;
      case 1: return form.people >= 1 && form.people <= 12;
      case 2: return form.budget > 0;
      case 3: return true;
      case 4: return form.basics.length > 0;
      case 5: return true;
      default: return true;
    }
  };

  // Renderizado de cada paso
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Para cuántos días quieres el menú y la lista de la compra?</label>
            <div className="flex items-center gap-4 justify-center">
              <button type="button" className="btn px-3 py-1 bg-secondary text-white rounded" onClick={() => setForm(f => ({ ...f, days: Math.max(1, f.days - 1) }))}>-</button>
              <input
                type="number"
                min={1}
                max={30}
                className="w-20 text-center border rounded px-2 py-1"
                value={form.days}
                onChange={e => setForm(f => ({ ...f, days: Math.max(1, Math.min(30, Number(e.target.value))) }))}
              />
              <button type="button" className="btn px-3 py-1 bg-secondary text-white rounded" onClick={() => setForm(f => ({ ...f, days: Math.min(30, f.days + 1) }))}>+</button>
              <span className="ml-2">días</span>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Cuántas personas sois en casa?</label>
            <div className="flex items-center gap-4 justify-center">
              <button type="button" className="btn px-3 py-1 bg-secondary text-white rounded" onClick={() => setForm(f => ({ ...f, people: Math.max(1, f.people - 1) }))}>-</button>
              <input
                type="number"
                min={1}
                max={12}
                className="w-20 text-center border rounded px-2 py-1"
                value={form.people}
                onChange={e => setForm(f => ({ ...f, people: Math.max(1, Math.min(12, Number(e.target.value))) }))}
              />
              <button type="button" className="btn px-3 py-1 bg-secondary text-white rounded" onClick={() => setForm(f => ({ ...f, people: Math.min(12, f.people + 1) }))}>+</button>
              <span className="ml-2">personas</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Con qué presupuesto contamos?</label>
            <div className="flex items-center gap-4 justify-center">
              <input
                type="number"
                min={1}
                className="w-32 text-center border rounded px-2 py-1"
                value={form.budget}
                onChange={e => setForm(f => ({ ...f, budget: Math.max(1, Number(e.target.value)) }))}
              />
              <span className="ml-2">€</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Qué tipo de alimentos soléis tomar en…?</label>
            <MultiSelect
              label="Desayuno"
              value={form.breakfast}
              onChange={v => setForm(f => ({ ...f, breakfast: v }))}
              suggestions={foodSuggestions}
            />
            <MultiSelect
              label="Comida"
              value={form.lunch}
              onChange={v => setForm(f => ({ ...f, lunch: v }))}
              suggestions={foodSuggestions}
            />
            <MultiSelect
              label="Cena"
              value={form.dinner}
              onChange={v => setForm(f => ({ ...f, dinner: v }))}
              suggestions={foodSuggestions}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Qué alimentos básicos debemos incluir siempre?</label>
            <MultiSelect
              label="Básicos"
              value={form.basics}
              onChange={v => setForm(f => ({ ...f, basics: v }))}
              suggestions={basicsSuggestions}
            />
          </div>
        );
      case 5:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Aparte de alimentos, necesitas comprar algo más?</label>
            <div className="flex flex-col gap-2 mb-2">
              {extrasOptions.map(opt => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.extras.includes(opt)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(f => ({ ...f, extras: [...f.extras, opt] }));
                      } else {
                        setForm(f => ({ ...f, extras: f.extras.filter(x => x !== opt) }));
                      }
                    }}
                  />
                  {opt}
                </label>
              ))}
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.extrasOther}
                  onChange={e => {
                    if (!e.target.checked) setForm(f => ({ ...f, extrasOther: '' }));
                  }}
                />
                Otros:
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  value={form.extrasOther}
                  onChange={e => setForm(f => ({ ...f, extrasOther: e.target.value }))}
                  placeholder="Especificar..."
                  disabled={!form.extrasOther && !form.extras.includes('Otros')}
                />
              </label>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">¿Alguna preferencia, alergia o restricción alimentaria?</label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[60px]"
              placeholder="Ej: Sin gluten, sin lactosa, vegetariano, etc. (opcional)"
              value={form.restrictions}
              onChange={e => setForm(f => ({ ...f, restrictions: e.target.value }))}
            />
          </div>
        );
      case 7:
        return (
          <div>
            <label className="block mb-4 text-lg font-semibold">Resumen de tus respuestas</label>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow-inner">
              <ul className="space-y-2">
                <li><b>Días:</b> {form.days}</li>
                <li><b>Personas:</b> {form.people}</li>
                <li><b>Presupuesto:</b> {form.budget} €</li>
                <li><b>Desayuno:</b> {form.breakfast.join(', ') || '—'}</li>
                <li><b>Comida:</b> {form.lunch.join(', ') || '—'}</li>
                <li><b>Cena:</b> {form.dinner.join(', ') || '—'}</li>
                <li><b>Básicos:</b> {form.basics.join(', ') || '—'}</li>
                <li><b>Otros:</b> {[...form.extras, form.extrasOther].filter(Boolean).join(', ') || '—'}</li>
                <li><b>Restricciones:</b> {form.restrictions || 'Ninguna'}</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn bg-secondary text-white px-4 py-2 rounded" onClick={() => setStep(0)}>Editar respuestas</button>
              <button type="submit" className="btn bg-accent text-white px-4 py-2 rounded">Confirmar y enviar</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Envío final (aquí solo mostramos un alert, pero se puede conectar a backend/IA)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Formulario enviado!\n' + JSON.stringify(form, null, 2));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 py-8">
      <form
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2 text-primary">🛒 Planificador de Compra</h1>
          <div className="text-sm text-gray-500">Paso {step + 1} de {steps.length}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="mb-8 min-h-[180px] flex flex-col justify-center">
          {renderStep()}
        </div>
        {step < steps.length - 1 && (
          <div className="flex justify-between">
            <button
              type="button"
              className="btn bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              ← Atrás
            </button>
            <button
              type="button"
              className="btn bg-accent text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => {
                setTouched(true);
                if (isValid()) setStep(s => Math.min(steps.length - 1, s + 1));
              }}
              disabled={!isValid()}
            >
              Siguiente →
            </button>
          </div>
        )}
        {/* Validación visual */}
        {!isValid() && touched && (
          <div className="mt-4 text-red-500 text-sm text-center">Por favor, completa correctamente este paso.</div>
        )}
      </form>
    </div>
  );
};

export default Home; 