import { TbBasketCancel } from "react-icons/tb";

interface CartItemProps {
  item: {
    product: {
      id: number;
      title: string;
      price: number;
    };
    quantity: number;
  };
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartItem = ({ item, updateQuantity, removeFromCart }: CartItemProps) => {
  return (
    <li key={item.product.id} className="flex-row justify-between mb-4 text-gray-300 border-solid border-b-[1px] pb-1 border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex flex-row justify-between items-center gap-2">
          <p>{item.product.title}</p>
        </div>

        <div className="flex items-center">
          {/* Boton para restar solo si quantity > 1 */}
          {item.quantity > 1 && (
            <button
            className="px-2 text-red-500"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              -
            </button>
          )}

          <span className="px-2">{item.quantity}</span>

          {/* Boton para agregar cantidad */}
          <button
            className="px-2 text-green-500"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
            +
          </button>

          {/* Boton para eliminar del carrito */}
          <button
            className="px-2 text-red-500"
            onClick={() => removeFromCart(item.product.id)}
            >
            <TbBasketCancel className="h-5 w-5" />
          </button>
            <p>${item.product.price.toFixed(2)}</p>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
