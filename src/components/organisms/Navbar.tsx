import { useState } from "react";
import CartSidebar from "./CartSideBar";
import { useCart } from "../../hooks/useCart";
import IconBurger from "../atoms/IconBurger";
import Title from "../atoms/common/Title";
import MenuNavbar from "../molecules/NavbarMenu";

interface NavbarProps {
  setActiveView: (view: string) => void;
}

const Navbar = ({ setActiveView }: NavbarProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <div className="bg-primary z-40 top-0 fixed lg:px-20 h-14 w-full flex flex-row-reverse justify-between items-center px-4 pt-2 box-shadow text-black text-lg">
        {/* Sección derecha: logo + icono */}
        <div className="flex flex-row gap-2 mt-[-6px] items-center">
          {/* Icono del carrito (abre/cierra el sidebar) */}
          <Title color="text-secundary" title="JF3 SERVICE" />
          <IconBurger onClick={toggleCart} productCount={cartItems.length} />
        </div>
        {/* Menú de navegación */}
        <MenuNavbar onClick={() => {}} setActiveView={setActiveView} />
      </div>

      {/* Sidebar del carrito */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
