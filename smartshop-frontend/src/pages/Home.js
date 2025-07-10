import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const initialFormData = {
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
function MultiSelect({ label, value, onChange, suggestions }) {
    const [input, setInput] = useState('');
    const addItem = (item) => {
        if (item && !value.includes(item)) {
            onChange([...value, item]);
            setInput('');
        }
    };
    return (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-2 font-medium", children: label }), _jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: value.map((item) => (_jsxs("span", { className: "bg-accent/20 text-accent px-2 py-1 rounded-full text-sm flex items-center gap-1", children: [item, _jsx("button", { type: "button", onClick: () => onChange(value.filter((i) => i !== item)), className: "ml-1 text-xs", children: "\u2715" })] }, item))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", className: "input input-bordered flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent", placeholder: "A\u00F1adir...", value: input, onChange: e => setInput(e.target.value), onKeyDown: e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addItem(input.trim());
                            }
                        }, list: label + '-suggestions' }), _jsx("button", { type: "button", className: "btn bg-accent text-white px-4 py-2 rounded", onClick: () => addItem(input.trim()), children: "A\u00F1adir" })] }), _jsx("datalist", { id: label + '-suggestions', children: suggestions.map(s => _jsx("option", { value: s }, s)) })] }));
}
const Home = () => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(initialFormData);
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
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFPara cu\u00E1ntos d\u00EDas quieres el men\u00FA y la lista de la compra?" }), _jsxs("div", { className: "flex items-center gap-4 justify-center", children: [_jsx("button", { type: "button", className: "btn px-3 py-1 bg-secondary text-white rounded", onClick: () => setForm(f => ({ ...f, days: Math.max(1, f.days - 1) })), children: "-" }), _jsx("input", { type: "number", min: 1, max: 30, className: "w-20 text-center border rounded px-2 py-1", value: form.days, onChange: e => setForm(f => ({ ...f, days: Math.max(1, Math.min(30, Number(e.target.value))) })) }), _jsx("button", { type: "button", className: "btn px-3 py-1 bg-secondary text-white rounded", onClick: () => setForm(f => ({ ...f, days: Math.min(30, f.days + 1) })), children: "+" }), _jsx("span", { className: "ml-2", children: "d\u00EDas" })] })] }));
            case 1:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFCu\u00E1ntas personas sois en casa?" }), _jsxs("div", { className: "flex items-center gap-4 justify-center", children: [_jsx("button", { type: "button", className: "btn px-3 py-1 bg-secondary text-white rounded", onClick: () => setForm(f => ({ ...f, people: Math.max(1, f.people - 1) })), children: "-" }), _jsx("input", { type: "number", min: 1, max: 12, className: "w-20 text-center border rounded px-2 py-1", value: form.people, onChange: e => setForm(f => ({ ...f, people: Math.max(1, Math.min(12, Number(e.target.value))) })) }), _jsx("button", { type: "button", className: "btn px-3 py-1 bg-secondary text-white rounded", onClick: () => setForm(f => ({ ...f, people: Math.min(12, f.people + 1) })), children: "+" }), _jsx("span", { className: "ml-2", children: "personas" })] })] }));
            case 2:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFCon qu\u00E9 presupuesto contamos?" }), _jsxs("div", { className: "flex items-center gap-4 justify-center", children: [_jsx("input", { type: "number", min: 1, className: "w-32 text-center border rounded px-2 py-1", value: form.budget, onChange: e => setForm(f => ({ ...f, budget: Math.max(1, Number(e.target.value)) })) }), _jsx("span", { className: "ml-2", children: "\u20AC" })] })] }));
            case 3:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFQu\u00E9 tipo de alimentos sol\u00E9is tomar en\u2026?" }), _jsx(MultiSelect, { label: "Desayuno", value: form.breakfast, onChange: v => setForm(f => ({ ...f, breakfast: v })), suggestions: foodSuggestions }), _jsx(MultiSelect, { label: "Comida", value: form.lunch, onChange: v => setForm(f => ({ ...f, lunch: v })), suggestions: foodSuggestions }), _jsx(MultiSelect, { label: "Cena", value: form.dinner, onChange: v => setForm(f => ({ ...f, dinner: v })), suggestions: foodSuggestions })] }));
            case 4:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFQu\u00E9 alimentos b\u00E1sicos debemos incluir siempre?" }), _jsx(MultiSelect, { label: "B\u00E1sicos", value: form.basics, onChange: v => setForm(f => ({ ...f, basics: v })), suggestions: basicsSuggestions })] }));
            case 5:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFAparte de alimentos, necesitas comprar algo m\u00E1s?" }), _jsxs("div", { className: "flex flex-col gap-2 mb-2", children: [extrasOptions.map(opt => (_jsxs("label", { className: "inline-flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: form.extras.includes(opt), onChange: e => {
                                                if (e.target.checked) {
                                                    setForm(f => ({ ...f, extras: [...f.extras, opt] }));
                                                }
                                                else {
                                                    setForm(f => ({ ...f, extras: f.extras.filter(x => x !== opt) }));
                                                }
                                            } }), opt] }, opt))), _jsxs("label", { className: "inline-flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: !!form.extrasOther, onChange: e => {
                                                if (!e.target.checked)
                                                    setForm(f => ({ ...f, extrasOther: '' }));
                                            } }), "Otros:", _jsx("input", { type: "text", className: "border rounded px-2 py-1 flex-1", value: form.extrasOther, onChange: e => setForm(f => ({ ...f, extrasOther: e.target.value })), placeholder: "Especificar...", disabled: !form.extrasOther && !form.extras.includes('Otros') })] })] })] }));
            case 6:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "\u00BFAlguna preferencia, alergia o restricci\u00F3n alimentaria?" }), _jsx("textarea", { className: "w-full border rounded px-3 py-2 min-h-[60px]", placeholder: "Ej: Sin gluten, sin lactosa, vegetariano, etc. (opcional)", value: form.restrictions, onChange: e => setForm(f => ({ ...f, restrictions: e.target.value })) })] }));
            case 7:
                return (_jsxs("div", { children: [_jsx("label", { className: "block mb-4 text-lg font-semibold", children: "Resumen de tus respuestas" }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-4 shadow-inner", children: _jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { children: [_jsx("b", { children: "D\u00EDas:" }), " ", form.days] }), _jsxs("li", { children: [_jsx("b", { children: "Personas:" }), " ", form.people] }), _jsxs("li", { children: [_jsx("b", { children: "Presupuesto:" }), " ", form.budget, " \u20AC"] }), _jsxs("li", { children: [_jsx("b", { children: "Desayuno:" }), " ", form.breakfast.join(', ') || '—'] }), _jsxs("li", { children: [_jsx("b", { children: "Comida:" }), " ", form.lunch.join(', ') || '—'] }), _jsxs("li", { children: [_jsx("b", { children: "Cena:" }), " ", form.dinner.join(', ') || '—'] }), _jsxs("li", { children: [_jsx("b", { children: "B\u00E1sicos:" }), " ", form.basics.join(', ') || '—'] }), _jsxs("li", { children: [_jsx("b", { children: "Otros:" }), " ", [...form.extras, form.extrasOther].filter(Boolean).join(', ') || '—'] }), _jsxs("li", { children: [_jsx("b", { children: "Restricciones:" }), " ", form.restrictions || 'Ninguna'] })] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "btn bg-secondary text-white px-4 py-2 rounded", onClick: () => setStep(0), children: "Editar respuestas" }), _jsx("button", { type: "submit", className: "btn bg-accent text-white px-4 py-2 rounded", children: "Confirmar y enviar" })] })] }));
            default:
                return null;
        }
    };
    // Envío final (aquí solo mostramos un alert, pero se puede conectar a backend/IA)
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Formulario enviado!\n' + JSON.stringify(form, null, 2));
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 py-8", children: _jsxs("form", { className: "w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in", onSubmit: handleSubmit, autoComplete: "off", children: [_jsxs("div", { className: "mb-6 text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-2 text-primary", children: "\uD83D\uDED2 Planificador de Compra" }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Paso ", step + 1, " de ", steps.length] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: _jsx("div", { className: "bg-accent h-2 rounded-full transition-all", style: { width: `${((step + 1) / steps.length) * 100}%` } }) })] }), _jsx("div", { className: "mb-8 min-h-[180px] flex flex-col justify-center", children: renderStep() }), step < steps.length - 1 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("button", { type: "button", className: "btn bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50", onClick: () => setStep(s => Math.max(0, s - 1)), disabled: step === 0, children: "\u2190 Atr\u00E1s" }), _jsx("button", { type: "button", className: "btn bg-accent text-white px-4 py-2 rounded disabled:opacity-50", onClick: () => {
                                setTouched(true);
                                if (isValid())
                                    setStep(s => Math.min(steps.length - 1, s + 1));
                            }, disabled: !isValid(), children: "Siguiente \u2192" })] })), !isValid() && touched && (_jsx("div", { className: "mt-4 text-red-500 text-sm text-center", children: "Por favor, completa correctamente este paso." }))] }) }));
};
export default Home;
