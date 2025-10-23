import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { InputLogin } from "./atoms/input";
import {
  getAliados,
  getAllDeliveryOptions,
  createDeliveryOption,
  updateDeliveryOption,
  deleteDeliveryOption,
} from "../constant/Api";

/** ---------- Tipos ---------- */
interface DeliveryOption {
  id: number;
  name: string;
  fee: number;
  aliadoId: number;
  createdAt?: string;
  updatedAt?: string;
}

interface DeliveryResponse {
  status: number;
  options: DeliveryOption[];
}

interface Aliado {
  id: number;
  name: string;
  image?: string;
  // otros campos según tu API...
}

/** ---------- Componente ---------- */
const PanelAdminDelivery: React.FC = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [selectedAliado, setSelectedAliado] = useState<number | null>(null);
  const [zones, setZones] = useState<DeliveryOption[]>([]);
  const [newZone, setNewZone] = useState<{ name: string; fee: string }>({ name: "", fee: "" });
  const [editZone, setEditZone] = useState<{
    id: number;
    name: string;
    fee: string;
    aliadoId: number;
  } | null>(null);

  /** Carga inicial de aliados */
  useEffect(() => {
    fetchAliados();
    // Si hay aliadoId en cookies, seleccionarlo y cargar sus zonas
    const idFromCookie = Cookies.get("aliadoId");
    if (idFromCookie) {
      const id = Number(idFromCookie);
      setSelectedAliado(id);
      fetchDeliveryZones(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Obtener aliados */
  const fetchAliados = async () => {
    try {
      const res = await getAliados();
      if (Array.isArray(res?.aliados)) {
        setAliados(res.aliados);
      } else {
        console.error("Respuesta inesperada getAliados():", res);
      }
    } catch (err) {
      console.error("Error fetching aliados:", err);
    }
  };

  /** Obtener todas las zonas, luego filtrar por aliadoId seleccionado */
  const fetchDeliveryZones = async (aliadoId: number) => {
    try {
      const res = await getAllDeliveryOptions();
      // forzamos el tipo de la respuesta que describe tu backend
      const data = res as unknown as DeliveryResponse;
      const options = Array.isArray(data?.options) ? data.options : [];
      const filtered = options.filter((z) => z.aliadoId === aliadoId);
      setZones(filtered);
    } catch (err) {
      console.error("Error fetching delivery options:", err);
      setZones([]);
    }
  };

  /** Crear zona */
  const handleAddZone = async () => {
    try {
      if (!selectedAliado) {
        alert("Selecciona un aliado primero");
        return;
      }
      await createDeliveryOption({
        name: newZone.name,
        fee: parseFloat(newZone.fee || "0"),
        aliadoId: selectedAliado,
      });
      setNewZone({ name: "", fee: "" });
      fetchDeliveryZones(selectedAliado);
    } catch (err) {
      console.error("Error creating delivery option:", err);
    }
  };

  /** Actualizar zona */
  const handleUpdateZone = async () => {
    try {
      if (!editZone) return;
      await updateDeliveryOption(editZone.id, {
        name: editZone.name,
        fee: parseFloat(editZone.fee || "0"),
      });
      setEditZone(null);
      if (selectedAliado) fetchDeliveryZones(selectedAliado);
    } catch (err) {
      console.error("Error updating delivery option:", err);
    }
  };

  /** Eliminar zona */
  const handleRemoveZone = async (zoneId: number) => {
    try {
      await deleteDeliveryOption(zoneId);
      if (selectedAliado) fetchDeliveryZones(selectedAliado);
    } catch (err) {
      console.error("Error deleting delivery option:", err);
    }
  };

  /** Manejo de inputs */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // solo permitir números y punto en fee
    if (name === "fee") {
      const sanitized = value.replace(/[^0-9.]/g, "");
      // evitar más de un punto
      const dots = sanitized.split(".").length - 1;
      if (dots > 1) return;
      if (editZone) setEditZone({ ...editZone, [name]: sanitized });
      else setNewZone({ ...newZone, [name]: sanitized });
    } else {
      if (editZone) setEditZone({ ...editZone, [name]: value });
      else setNewZone({ ...newZone, [name]: value });
    }
  };

  return (
    <div className="mx-4 p-2 bg-transparent border-primary border-2 rounded-sm mb-10">
      <h1 className="text-white text-2xl mb-6 text-center">Administrador de delivery</h1>

      {/* Selector de aliado */}
      <div className="flex justify-center mb-6">
        <select
          className="p-2 rounded text-black"
          value={selectedAliado ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value) || null;
            setSelectedAliado(id);
            if (id) {
              // guarda cookie si quieres persistir
              Cookies.set("aliadoId", String(id));
              fetchDeliveryZones(id);
            } else {
              setZones([]);
            }
          }}
        >
          <option value="">Selecciona un aliado</option>
          {aliados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario agregar / editar */}
      <div className="mb-6 flex flex-col justify-center items-center">
        <h2 className="text-white text-xl mb-6 text-center">
          {editZone ? "Editar zona de delivery" : "Agregar nueva zona de delivery"}
        </h2>

        <div className="flex flex-col justify-center items-center mb-4">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <InputLogin
              type="text"
              name="name"
              placeholder="Nombre de la zona"
              value={editZone ? editZone.name : newZone.name}
              onChange={handleInputChange}
            />
            <InputLogin
              type="text"
              name="fee"
              placeholder="Tarifa"
              value={editZone ? editZone.fee : newZone.fee}
              onChange={handleInputChange}
            />
          </div>

          <button
            className={`${editZone ? "bg-greenButton" : "bg-secundary"} text-black p-2 rounded w-24`}
            onClick={editZone ? handleUpdateZone : handleAddZone}
          >
            {editZone ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>

      {/* Listado de zonas */}
      {selectedAliado ? (
        <>
          <h2 className="text-white text-xl mb-2 text-center">Zonas de delivery</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 mx-4">
            {zones.length > 0 ? (
              zones.map((zone: DeliveryOption) => (
                <div key={zone.id}>
                  <div className="bg-transparent border-gray-500 border-2 rounded-md p-4 mb-2 text-white flex flex-row gap-4">
                    <p>{zone.name}</p>
                    <p>Tarifa: {zone.fee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-center my-5 gap-4">
                    <button
                      className="bg-green-400 text-white p-2 rounded mr-2 w-24"
                      onClick={() =>
                        setEditZone({
                          id: zone.id,
                          name: zone.name,
                          fee: String(zone.fee),
                          aliadoId: zone.aliadoId,
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="bg-fourth text-white p-2 rounded w-24"
                      onClick={() => handleRemoveZone(zone.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay zonas registradas para este aliado.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center">Selecciona un aliado para ver sus zonas de delivery.</p>
      )}
    </div>
  );
};

export default PanelAdminDelivery;
