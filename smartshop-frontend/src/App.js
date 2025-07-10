import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Resultados from './pages/Resultados';
import Historial from './pages/Historial';
import Productos from './pages/Productos';
import NotFound from './pages/NotFound';
import Lista from './pages/Lista';
function App() {
    return (_jsxs(Router, { children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/productos", element: _jsx(Productos, {}) }), _jsx(Route, { path: "/resultados", element: _jsx(Resultados, {}) }), _jsx(Route, { path: "/historial", element: _jsx(Historial, {}) }), _jsx(Route, { path: "/lista", element: _jsx(Lista, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })] }));
}
export default App;
