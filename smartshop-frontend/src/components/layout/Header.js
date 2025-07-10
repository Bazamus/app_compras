import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Navbar from '../Navbar';
import MenuIcon from '../icons/MenuIcon';
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleLinkClick = () => {
        setIsOpen(false);
    };
    return (_jsxs("header", { className: "bg-white shadow-md sticky top-0 z-10", children: [_jsxs("div", { className: "container mx-auto px-4 flex justify-between items-center py-4", children: [_jsx("h1", { className: "text-xl font-bold text-blue-700", children: "App Compras" }), _jsx("div", { className: "hidden md:flex flex-grow justify-center", children: _jsx(Navbar, {}) }), _jsx("div", { className: "md:hidden", children: _jsx("button", { onClick: () => setIsOpen(!isOpen), "aria-label": "Abrir men\u00FA", children: _jsx(MenuIcon, {}) }) })] }), isOpen && (_jsx("div", { className: "md:hidden bg-white border-t border-gray-200", children: _jsx(Navbar, { onLinkClick: handleLinkClick }) }))] }));
};
export default Header;
