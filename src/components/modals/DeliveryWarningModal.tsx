// src/components/modals/DeliveryWarningModal.tsx
import { motion } from "framer-motion";
import Button from "../atoms/common/Button";

interface DeliveryWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryWarningModal = ({ isOpen, onClose }: DeliveryWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-[90%] sm:w-[400px] bg-black/80 border border-secundary rounded-2xl shadow-lg p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-secundary mb-3">¡Atención!</h2>
        <p className="text-gray-300 mb-6">
          Debes seleccionar una opción de <span className="text-secundary">delivery</span> antes de generar tu pedido.
        </p>

        <Button
          label="Entendido"
          onClick={onClose}
          className="w-full py-2 bg-gradient-to-r from-secundary to-fourth text-white rounded-xl font-semibold hover:opacity-90"
        />
      </motion.div>
    </div>
  );
};

export default DeliveryWarningModal;
