import { useState } from 'react';
import Navbar from '../Navbar';
import MenuIcon from '../icons/MenuIcon';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <h1 className="text-xl font-bold text-blue-700">App Compras</h1>
        
        {/* Desktop Navbar */}
        <div className="hidden md:flex flex-grow justify-center">
          <Navbar />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú">
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Navbar onLinkClick={handleLinkClick} />
        </div>
      )}
    </header>
  );
};

export default Header;
