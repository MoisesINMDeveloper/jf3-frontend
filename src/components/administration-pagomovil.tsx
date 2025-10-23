import { useEffect, useState } from "react";
import {
  getAllPaydates,
  createPaydate,
  updatePaydate,
  deletePaydate,
  type Paydate,
} from "../constant/Api";
import { InputLogin } from "./atoms/input";

type PaydateResponse = { paydates?: Paydate[] };

export const PanelAdminMobilePayment = () => {
  const [paymentOptions, setPaymentOptions] = useState<Paydate[]>([]);
  const [newPaymentOption, setNewPaymentOption] = useState<Omit<Paydate, "id">>({
    bank: "",
    code: "",
    cedula: "",
    phone: "",
  });
  const [editPaymentOption, setEditPaymentOption] = useState<Paydate | null>(null);

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const fetchPaymentOptions = async () => {
    try {
      const res = await getAllPaydates();
      const paydates =
        Array.isArray(res)
          ? (res as PaydateResponse[]).flatMap((r) => r.paydates ?? [])
          : ((res as PaydateResponse).paydates ?? []);
      setPaymentOptions(paydates);
    } catch (error) {
      console.error("Error fetching payment options:", error);
    }
  };

  const handleCreatePaymentOption = async () => {
    try {
      await createPaydate(newPaymentOption);
      fetchPaymentOptions();
      setNewPaymentOption({ bank: "", code: "", cedula: "", phone: "" });
    } catch (error) {
      console.error("Error creating payment option:", error);
    }
  };

  const handleUpdatePaymentOption = async () => {
    if (!editPaymentOption) return;
    try {
      await updatePaydate(editPaymentOption.id, editPaymentOption);
      fetchPaymentOptions();
      setEditPaymentOption(null);
    } catch (error) {
      console.error("Error updating payment option:", error);
    }
  };

  const handleDeletePaymentOption = async (paymentId: number) => {
    try {
      await deletePaydate(paymentId);
      fetchPaymentOptions();
    } catch (error) {
      console.error("Error deleting payment option:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editPaymentOption) {
      setEditPaymentOption({ ...editPaymentOption, [name]: value });
    } else {
      setNewPaymentOption({ ...newPaymentOption, [name]: value });
    }
  };

  const inputFields = [
    { name: "bank", placeholder: "Banco" },
    { name: "code", placeholder: "Código" },
    { name: "cedula", placeholder: "Cédula" },
    { name: "phone", placeholder: "Teléfono" },
  ] as const;

  return (
    <div className="mx-2 mb-4 p-4 bg-transparent border-secundary border-2 rounded-sm">
      <h1 className="text-white text-2xl text-center mb-4">
        Administrador de Pago Móvil
      </h1>

      {/* Formulario agregar / editar */}
      <div className="mb-6 flex flex-col justify-center items-center">
        <h2 className="text-white text-center text-xl mb-6">
          {editPaymentOption
            ? "Editar opción de pago móvil"
            : "Agregar nueva opción de pago móvil"}
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {inputFields.map((field) => (
            <InputLogin
              key={field.name}
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={
                editPaymentOption
                  ? editPaymentOption[field.name]
                  : newPaymentOption[field.name]
              }
              onChange={handleInputChange}
            />
          ))}
        </div>

        <div className="flex justify-center mt-5">
          {editPaymentOption ? (
            <button
              className="bg-green-400 text-white p-2 rounded w-24"
              onClick={handleUpdatePaymentOption}
            >
              Actualizar
            </button>
          ) : (
            <button
              className="bg-green-400 text-black p-2 rounded w-24"
              onClick={handleCreatePaymentOption}
            >
              Agregar
            </button>
          )}
        </div>
      </div>

      {/* Listado de opciones */}
      <div className="flex flex-col items-center justify-center gap-6">
        <h2 className="text-white text-xl mb-2">Opciones de pago móvil</h2>
        {paymentOptions.length > 0 ? (
          paymentOptions.map((option) => (
            <div key={option.id}>
              <div className="bg-transparent border-secundary border-2 rounded-md p-4 mb-2 text-white flex flex-col gap-4">
                <p>
                  {option.bank} - {option.code} - {option.cedula} - {option.phone}
                </p>
              </div>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  className="bg-secundary text-black p-2 rounded mr-2 w-24"
                  onClick={() => setEditPaymentOption(option)}
                >
                  Editar
                </button>
                <button
                  className="bg-fourth text-white p-2 rounded w-24"
                  onClick={() => handleDeletePaymentOption(option.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            No hay opciones de pago móvil registradas.
          </p>
        )}
      </div>
    </div>
  );
};
