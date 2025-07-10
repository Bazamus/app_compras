import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onLinkClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLinkClick }) => {
  const { pathname } = useLocation();
  const linkClass = (path: string) =>
    `block md:inline-block px-4 py-2 rounded hover:bg-blue-100 transition-colors w-full md:w-auto text-center md:text-left ${
      pathname === path ? 'bg-blue-500 text-white' : 'text-blue-700'
    }`;

  return (
    <nav className="flex flex-col md:flex-row md:gap-4 py-4 bg-white mb-6">
      <Link to="/" className={linkClass('/')} onClick={onLinkClick}>Inicio</Link>
      <Link to="/productos" className={linkClass('/productos')} onClick={onLinkClick}>Explorar</Link>
      <Link to="/resultados" className={linkClass('/resultados')} onClick={onLinkClick}>Resultados</Link>
      <Link to="/historial" className={linkClass('/historial')} onClick={onLinkClick}>Historial</Link>
    </nav>
  );
};

export default Navbar;