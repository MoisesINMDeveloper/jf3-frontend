import { createContext, useContext, useState, type ReactNode } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  description: string;
  aliadoId?: number | undefined;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  aliadoId: number | null;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [aliadoId, setAliadoId] = useState<number | null>(null);

  const addToCart = (product: Product) => {
    // Si el carrito está vacío, definimos el aliadoId del primer producto
    if (!aliadoId) {
      setAliadoId(product.aliadoId ?? null);
    }

    // Si el producto pertenece a otro aliado, bloqueamos la acción
    if (aliadoId && aliadoId !== product.aliadoId) {
      alert("Solo puedes agregar productos del mismo aliado.");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      // Si el carrito queda vacío, reseteamos el aliado
      if (updated.length === 0) {
        setAliadoId(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAliadoId(null);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        aliadoId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
