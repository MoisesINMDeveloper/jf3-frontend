import { useState, type ChangeEvent, useEffect } from "react";
import { IoMdCopy } from "react-icons/io";
import InfoRow from "../atoms/common/InfoRow";
import Button from "../atoms/common/Button";
import { getAllPaydates } from "../../constant/Api";

interface PaymentModalProps {
  total: number;
  onConfirm: (referenceNumber: string) => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  onConfirm,
  onClose,
}) => {
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await getAllPaydates();
        // Aceptar tanto un array directo (PaydateResponse[]) como un objeto { paydates: PaydateResponse[] }
        if (Array.isArray(response)) {
          setPaymentData(response);
        } else if (response && Array.isArray((response as any).paydates)) {
          setPaymentData((response as any).paydates);
        } else {
          setError("No se encontraron opciones de pago.");
        }
      } catch (err) {
        console.error("Error fetching payment options:", err);
        setError(
          "No se pudo cargar la información de pago. Intenta nuevamente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentData();
  }, []);

  const handleCopy = (): void => {
    if (paymentData.length === 0) return;

    const { bank, code, cedula, phone } = paymentData[0];

    const textToCopy = `
Banco: ${bank}
Código: ${code}
Cédula: ${cedula}
Teléfono: ${phone}
Monto: USD ${total.toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="w-screen border border-primary text-gray-300 bg-black/80 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center animate-pulse">
            Cargando datos de pago...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="w-screen border border-red-500 text-gray-300 bg-black/80 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
          <p>{error}</p>
          <Button
            onClick={onClose}
            label="Cerrar"
            color="bg-red-500 active:bg-fourth text-white"
          />
        </div>
      </div>
    );
  }

  if (paymentData.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="w-screen border border-primary text-gray-300 bg-black/80 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Sin datos disponibles</h2>
        </div>
      </div>
    );
  }

  // ✅ Tomamos el primer banco por defecto (podrías permitir selección si quieres)
  const { bank, code, cedula, phone } = paymentData[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-[90%] max-w-md border border-secundary text-gray-200 bg-black/70 p-5 rounded-2xl shadow-lg relative">
        <div className="flex flex-row justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white">Información de Pago</h2>
          <IoMdCopy
            className="w-6 h-6 cursor-pointer text-fourth hover:text-secundary transition-colors"
            onClick={handleCopy}
          />
        </div>

        <div className="text-center mb-3">
          <strong className="underline text-red-400">ADVERTENCIA</strong>
          <p className="text-gray-400 text-sm">
            Verifica disponibilidad de los productos antes de realizar el pago.
          </p>
        </div>

        <div className="space-y-1 mb-4">
          <InfoRow label="Banco" value={bank} />
          <InfoRow label="Código" value={code} />
          <InfoRow label="Cédula" value={cedula} />
          <InfoRow label="Teléfono" value={phone} />
          <InfoRow label="Monto" value={`USD ${total.toFixed(2)}`} />
        </div>

        <input
          type="text"
          value={referenceNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setReferenceNumber(e.target.value)
          }
          placeholder="Número de referencia"
          className="w-full p-2 mt-2 mb-4 border rounded-lg border-secundary bg-transparent text-gray-200 outline-none focus:ring-2 focus:ring-fourth"
        />

        <div className="flex justify-center gap-3">
          <Button
            onClick={() => onConfirm(referenceNumber)}
            label="Confirmar"
            color="bg-gradient-to-r from-green-500 text-white"
          />
          <Button
            onClick={onClose}
            label="Cancelar"
            color="bg-gradient-to-l from-fourth active:bg-fourth text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
