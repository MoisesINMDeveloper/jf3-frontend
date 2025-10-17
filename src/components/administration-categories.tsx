import { useState, useEffect } from "react";
import { InputLogin } from "./atoms/input";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAliados,
} from "../constant/Api";

interface Aliado {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  aliadoId: number;
}

const PanelAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedAliadoId, setSelectedAliadoId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [aliados, setAliados] = useState<Aliado[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchAliados();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      fetchedCategories.sort((a: Category, b: Category) => {
        if (a.aliadoId !== b.aliadoId) return a.aliadoId - b.aliadoId;
        return a.name.localeCompare(b.name);
      });
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAliados = async () => {
    try {
      const fetchedAliados = await getAliados();
      setAliados(fetchedAliados);
    } catch (error) {
      console.error("Error fetching aliados:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !selectedAliadoId)
      return alert("Completa todos los campos");
    try {
      await createCategory(newCategory, selectedAliadoId);
      setNewCategory("");
      setSelectedAliadoId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory?.name || !editCategory?.aliadoId)
      return alert("Completa todos los campos");
    try {
      await updateCategory(editCategory.id, {
        name: editCategory.name,
        aliadoId: editCategory.aliadoId,
      });
      await updateCategory(editCategory.id, {
        name: editCategory.name,
        aliadoId: editCategory.aliadoId,
      });
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="mx-2 p-2 bg-transparent border-primary border-2 rounded-sm mb-10">
      <h1 className="text-white text-2xl mb-4 text-center">
        Administrador de categorías
      </h1>

      <div className="mb-6 flex flex-col justify-center items-center">
        <h2 className="text-white text-xl mb-6 text-center">
          {editCategory ? "Editar categoría" : "Agregar nueva categoría"}
        </h2>

        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <InputLogin
            type="text"
            name="name"
            placeholder="Nombre de la categoría"
            value={editCategory ? editCategory.name : newCategory}
            onChange={(e) =>
              editCategory
                ? setEditCategory({ ...editCategory, name: e.target.value })
                : setNewCategory(e.target.value)
            }
          />

          {/* Select de Aliado */}
          <select
            className="w-64 p-2 rounded border border-gray-700 bg-gray-800 text-white outline-none"
            value={
              editCategory ? editCategory.aliadoId : selectedAliadoId ?? ""
            }
            onChange={(e) => {
              const id = Number(e.target.value);
              editCategory
                ? setEditCategory({ ...editCategory, aliadoId: id })
                : setSelectedAliadoId(id);
            }}
          >
            <option value="" disabled>
              Selecciona un aliado
            </option>
            {aliados.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <button
            className={`${
              editCategory ? "bg-greenButton" : "bg-primary"
            } text-white p-2 rounded w-24`}
            onClick={editCategory ? handleUpdateCategory : handleAddCategory}
          >
            {editCategory ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>

      <h2 className="text-white text-xl mb-2 text-center">Categorías</h2>
      <div className="flex flex-wrap items-start justify-center gap-6 mx-4">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center">
            <div className="bg-transparent border-primary border-2 rounded-md p-4 mb-2 text-white flex flex-col gap-2 w-64">
              <p className="font-bold">{category.name}</p>
              <p className="text-gray-400 text-sm">
                Aliado:{" "}
                {aliados.find((a) => a.id === Number(category.aliadoId))
                  ?.name ?? "N/A"}
              </p>
            </div>
            <div className="flex justify-center my-2 gap-4">
              <button
                className="bg-greenButton text-white p-2 rounded w-24"
                onClick={() => setEditCategory(category)}
              >
                Editar
              </button>
              <button
                className="bg-redButton text-white p-2 rounded w-24"
                onClick={() => handleRemoveCategory(category.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelAdminCategories;
