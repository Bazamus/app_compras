import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
const Navbar = ({ onLinkClick }) => {
    const { pathname } = useLocation();
    const linkClass = (path) => `block md:inline-block px-4 py-2 rounded hover:bg-blue-100 transition-colors w-full md:w-auto text-center md:text-left ${pathname === path ? 'bg-blue-500 text-white' : 'text-blue-700'}`;
    return (_jsxs("nav", { className: "flex flex-col md:flex-row md:gap-4 py-4 bg-white mb-6", children: [_jsx(Link, { to: "/", className: linkClass('/'), onClick: onLinkClick, children: "Inicio" }), _jsx(Link, { to: "/productos", className: linkClass('/productos'), onClick: onLinkClick, children: "Explorar" }), _jsx(Link, { to: "/resultados", className: linkClass('/resultados'), onClick: onLinkClick, children: "Resultados" }), _jsx(Link, { to: "/historial", className: linkClass('/historial'), onClick: onLinkClick, children: "Historial" })] }));
};
export default Navbar;
