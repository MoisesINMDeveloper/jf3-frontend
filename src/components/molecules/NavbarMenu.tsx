import { useState, useEffect, useRef } from 'react';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import ItemsMenu from '../atoms/ItemsMenu';
import SideBar from './sidebar';

interface MenuNavbarProps {
  onClick: () => void;
  setActiveView: (view: string) => void;
}

const MenuNavbar = ({ onClick, setActiveView }: MenuNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleNavbarMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onClick();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const isAdminPage = location.pathname === '/administration-panel';

  return (
    <div ref={menuRef} className="z-50">
      {/* Botón de menú móvil */}
      <div className="block lg:hidden">
        <button className="w-auto h-auto mb-2" onClick={handleNavbarMenuClick}>
          {isMenuOpen ? (
            <IoMdClose className="w-8 h-8 text-secundary transition-all duration-300" />
          ) : (
            <IoMdMenu className="w-8 h-8 text-secundary transition-all duration-300" />
          )}
        </button>

        {isMenuOpen && (
          <>
            {isAdminPage ? (
              <SideBar setActiveView={setActiveView} />
            ) : (
              <ItemsMenu />
            )}
          </>
        )}
      </div>

      {/* Menú grande para escritorio */}
      <div className="hidden lg:block">
        {isAdminPage ? <SideBar setActiveView={setActiveView} /> : <ItemsMenu />}
      </div>
    </div>
  );
};

export default MenuNavbar;
