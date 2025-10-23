import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentModal from "../modals/PaymentModal";
import NotificationComponent from "../modals/Notification";
import CartCommentsComponent from "../atoms/CartComments";
import Button from "../atoms/common/Button";
import CloseCartIcon from "../atoms/CloseCartIcon";
import CartTotal from "../atoms/CartTotal";
import CartItem from "../atoms/CartItem";
import { useCart } from "../../hooks/useCart";
import data from "../../constant/data";
import DeliveryOptionModal from "../modals/DeliveryOptionModal";
import ButtonDelivery from "../atoms/common/ButtonDelivery";
import { TbBasketCancel } from "react-icons/tb";
import DeliveryWarningModal from "../modals/DeliveryWarningModal";
import { getAliados } from "../../constant/Api"; // <-- importar lista completa

interface Aliado {
  id: number;
  name: string;
  phone?: string;
}

const CartSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [isDeliveryOptionOpen, setIsDeliveryOptionOpen] = useState(false);
  const [isDeliveryWarningOpen, setIsDeliveryWarningOpen] = useState(false);

  const [aliado, setAliado] = useState<Aliado | null>(null);

  const location = useLocation();
  const aliadoId = (() => {
    const path = location.pathname;
    const match = path.match(/aliados\/(\d+)/);
    return match ? Number(match[1]) : null;
  })();

  // Traer todos los aliados y buscar el que coincide con la URL
  useEffect(() => {
  if (aliadoId) {
    getAliados()
      .then((res) => {
        // res tiene forma { aliados: Aliado[] }
        const found = res.aliados.find((a: Aliado) => a.id === aliadoId);
        if (found) setAliado(found);
        else console.error("Aliado no encontrado en la lista completa");
      })
      .catch((err) => console.error("Error fetching aliados:", err));
  }
}, [aliadoId]);


  const subtotal: number = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const total: number = subtotal + deliveryFee;

  // Cerrar sidebar con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handlePaymentClick = (): void => {
    if (!deliveryLocation || cartItems.length === 0) {
      setIsDeliveryWarningOpen(true);
      return;
    }

    const orderSummary = cartItems
      .map((item) => `${item.quantity} ${item.product.title}`)
      .join(", ");

    const orderInfo = {
      orderSummary,
      subtotal,
      deliveryFee,
      total,
      comment,
      deliveryLocation,
    };

    localStorage.setItem("cartInfo", JSON.stringify(orderInfo));
    setIsModalOpen(true);
    onClose();
  };

  const handleConfirm = (referenceNumber: string): void => {
    if (!aliado) {
      alert("No se ha podido obtener el nombre del aliado. Intenta de nuevo.");
      return;
    }

    setIsModalOpen(false);
    setIsNotificationVisible(true);

    const cartInfo = JSON.parse(localStorage.getItem("cartInfo")!);

    const message = `Hola ${data?.contactData[0]?.name}, dejo mi pedido con los siguientes detalles:\n
Aliado: ${aliado.name}
Pedido: ${cartInfo.orderSummary}
Subtotal: $${cartInfo.subtotal.toFixed(2)}
Delivery (${cartInfo.deliveryLocation}): $${cartInfo.deliveryFee.toFixed(2)}
Total: $${cartInfo.total.toFixed(2)}
Comentario: ${cartInfo.comment}
Referencia: ${referenceNumber}`;

    const phoneNumber = `${data?.paydates?.phone}`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappLink, "_blank");

    setTimeout(() => {
      localStorage.removeItem("cartInfo");
      setIsNotificationVisible(false);
      window.location.reload();
    }, 4000);
  };

  const handleRemoveDelivery = () => {
    setDeliveryFee(0);
    setDeliveryLocation("");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" />}

      <div
        ref={sidebarRef}
        className={`fixed z-50 top-14 right-0 h-[calc(100vh-3.5rem)] w-full sm:w-[380px] border-2 border-t-0 rounded-lg rounded-t-none border-primary text-gray-300 bg-black shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Tu pedido</h2>
          <button onClick={onClose}>
            <CloseCartIcon />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[80%]">
          <ButtonDelivery
            color="w-full text-lg mt-2"
            onClick={() => setIsDeliveryOptionOpen(true)}
            label="Cambiar servicio de delivery"
          />

          <ul className="overflow-y-auto max-h-60">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4">
                Tu carrito está vacío.
              </p>
            )}

            {deliveryLocation && (
              <li className="flex justify-between items-center mt-2">
                <p className="font-semibold">Delivery - {deliveryLocation}</p>
                <div className="flex flex-row justify-between items-center">
                  <button
                    onClick={handleRemoveDelivery}
                    className="text-red-500 px-2"
                  >
                    <TbBasketCancel className="h-5 w-5" />
                  </button>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </li>
            )}
          </ul>

          <CartTotal total={total} />
          <CartCommentsComponent comment={comment} setComment={setComment} />

          <Button
            color="w-full text-lg bg-secundary text-black"
            onClick={handlePaymentClick}
            label="Generar pedido"
          />
        </div>
      </div>

      {isModalOpen && (
        <PaymentModal
          total={total}
          onConfirm={handleConfirm}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isNotificationVisible && <NotificationComponent />}

      {isDeliveryOptionOpen && aliadoId && (
        <DeliveryOptionModal
          aliadoId={aliadoId}
          isOpen={isDeliveryOptionOpen}
          onClose={() => setIsDeliveryOptionOpen(false)}
          setDeliveryFee={setDeliveryFee}
          setDeliveryLocation={setDeliveryLocation}
        />
      )}

      {isDeliveryWarningOpen && (
        <DeliveryWarningModal
          isOpen={isDeliveryWarningOpen}
          onClose={() => setIsDeliveryWarningOpen(false)}
        />
      )}
    </>
  );
};

export default CartSidebar;
