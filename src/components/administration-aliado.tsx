import { useState, useEffect } from "react";
import {
  getAliados,
  createAliado,
  updateAliado,
  deleteAliado,
} from "../constant/Api";

interface Aliado {
  id: number;
  name: string;
  image: string;
}

const PanelAdminAliados = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<string>("");
  const [editingAliado, setEditingAliado] = useState<Aliado | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Obtener aliados al montar el componente
  useEffect(() => {
    const fetchAliados = async () => {
      try {
        setLoading(true);
        const data = await getAliados();
        setAliados(data.aliados);
      } catch (error) {
        console.error("Error fetching aliados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAliados();
  }, []);

  // 🔹 Convertir imagen a base64
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 🔹 Crear nuevo aliado
  const handleCreate = async () => {
    if (!newName || !newImage) {
      alert("Por favor completa el nombre e imagen del aliado.");
      return;
    }

    try {
      setLoading(true);
      const created = await createAliado({ name: newName, image: newImage });
      setAliados((prev) => [...prev, created]);
      setNewName("");
      setNewImage("");
    } catch (error) {
      console.error("Error creando aliado:", error);
      alert("Error al crear aliado. Verifica la consola.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Actualizar aliado existente
  const handleUpdate = async () => {
    if (!editingAliado) return;

    try {
      setLoading(true);
      const updated = await updateAliado(editingAliado.id, {
        name: editingAliado.name,
        image: editingAliado.image,
      });

      setAliados((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setEditingAliado(null);
    } catch (error) {
      console.error("Error actualizando aliado:", error);
      alert("Error al actualizar aliado.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar aliado
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este aliado?")) return;

    try {
      setLoading(true);
      await deleteAliado(id);
      setAliados((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error eliminando aliado:", error);
      alert("Error al eliminar aliado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white flex flex-col gap-6 bg-[#1a1a1a] rounded-lg">
      <h2 className="text-2xl font-semibold">Administración de Aliados</h2>

      {/* 🔹 Formulario de creación */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-gray-800 p-4 rounded-lg">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del aliado"
          className="px-3 py-2 rounded text-black w-full md:w-auto"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setNewImage)}
          className="text-sm text-gray-300"
        />

        {newImage && (
          <img
            src={newImage}
            alt="Vista previa"
            className="w-16 h-16 rounded object-cover border border-gray-600"
          />
        )}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>

      {/* 🔹 Lista de aliados */}
      {loading && aliados.length === 0 ? (
        <p className="text-gray-400 text-center">Cargando aliados...</p>
      ) : aliados.length === 0 ? (
        <p className="text-gray-400 text-center">No hay aliados registrados.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {aliados.map((aliado) => (
            <li
              key={aliado.id}
              className="flex flex-col md:flex-row items-center gap-3 bg-gray-800 p-3 rounded-lg"
            >
              <img
                src={aliado.image}
                alt={aliado.name}
                className="w-16 h-16 object-cover rounded border border-gray-700"
              />

              {editingAliado?.id === aliado.id ? (
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <input
                    value={editingAliado.name}
                    onChange={(e) =>
                      setEditingAliado({
                        ...editingAliado,
                        name: e.target.value,
                      })
                    }
                    className="px-2 py-1 rounded text-black"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) =>
                        setEditingAliado({
                          ...editingAliado,
                          image: base64,
                        })
                      )
                    }
                  />

                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() => setEditingAliado(null)}
                    className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-3">
                  <span className="text-lg font-medium">{aliado.name}</span>

                  <button
                    onClick={() => setEditingAliado(aliado)}
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(aliado.id)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PanelAdminAliados;
