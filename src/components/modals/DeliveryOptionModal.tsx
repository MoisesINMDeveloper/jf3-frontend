import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { getAllDeliveryOptions } from "../../constant/Api";

interface DeliveryOption {
  id: number;
  name: string;
  fee: number;
  aliadoId: number;
}

interface DeliveryOptionModalProps {
  aliadoId: number; // ✅ Nuevo prop para saber de qué aliado se mostrarán las zonas
  setDeliveryFee: Dispatch<SetStateAction<number>>;
  setDeliveryLocation: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryOptionModal = ({
  aliadoId,
  setDeliveryFee,
  setDeliveryLocation,
  isOpen,
  onClose,
}: DeliveryOptionModalProps) => {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");

  // ✅ Cargar las opciones de delivery filtradas por aliadoId
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const response = await getAllDeliveryOptions();

        // Si el backend devuelve { status, options: [] }, tomamos solo las options
        const options = Array.isArray(response)
          ? response
          : ((response as any)?.options ?? []);

        // ✅ Filtramos las zonas del aliado actual
        const filtered = options.filter(
          (option: DeliveryOption) => option.aliadoId === aliadoId
        );

        setDeliveryOptions(filtered);
      } catch (error) {
        console.error("Error fetching delivery options:", error);
      }
    };

    if (isOpen && aliadoId) {
      fetchDeliveryOptions();
    }
  }, [isOpen, aliadoId]);

  const handleDeliveryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSelectedDelivery(selectedOption);

    const deliveryOption = deliveryOptions.find(
      (option) => option.name === selectedOption
    );
    if (deliveryOption) {
      setDeliveryFee(deliveryOption.fee);
      setDeliveryLocation(deliveryOption.name);
    } else {
      setDeliveryFee(0);
      setDeliveryLocation("");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black border-2 border-primary rounded-lg p-6 w-72 shadow-lg">
          <label className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold mb-4 text-gray-300 text-center">
              Seleccione la región
            </h2>

            {deliveryOptions.length > 0 ? (
              <select
                value={selectedDelivery}
                onChange={handleDeliveryChange}
                className="form-select mt-1 block w-full outline-none bg-black text-white border-secundary border-2 shadow-sm focus:ring-opacity-50"
              >
                <option className="text-" value="">
                  Ninguno
                </option>
                {deliveryOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name} ({option.fee.toFixed(2)} USD)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-400 text-center text-sm">
                No hay zonas de delivery disponibles para este aliado.
              </p>
            )}
          </label>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md active:bg-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
    </>
  );
};

export default DeliveryOptionModal;
