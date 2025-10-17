import { useState, useEffect } from "react";
import { createProduct, getAllCategories } from "../constant/Api";
import type { Product } from "./administration-products";

interface Category {
  id: number;
  name: string;
}

interface Aliado {
  id: number;
  name: string;
}

interface CreateProductModalProps {
  aliados?: Aliado[];
  onClose: () => void;
  onSave: (newProduct: Product) => void;
  initialAliadoId?: number;
}

const CreateProductModal = ({
  aliados = [],
  onClose,
  onSave,
  initialAliadoId,
}: CreateProductModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [images, setImages] = useState<string[]>([]);
  const [aliadoId, setAliadoId] = useState<number | null>(initialAliadoId ?? null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Cargar categorías según aliado
  useEffect(() => {
  if (!aliadoId) {
    setCategories([]);
    setCategoryId(null);
    return;
  }

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      const filtered = res.filter((c: any) => c.aliadoId === aliadoId);
      setCategories(filtered);
      setCategoryId(null);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setCategories([]);
    }
  };

  fetchCategories();
}, [aliadoId]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const promises = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );
      Promise.all(promises).then(setImages).catch(console.error);
    }
  };

  const handleSave = async () => {
    if (!aliadoId || !categoryId) return alert("Selecciona aliado y categoría");
    if (!title || !description || !price) return alert("Completa todos los campos");

    try {
      const newProduct = await createProduct({
        title,
        description,
        price: Number(price),
        images,
        categoryId,
        aliadoId,
      });

      onSave(newProduct); // actualizar estado en el panel
      onClose(); // cerrar modal
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Error al crear el producto");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 w-[400px] p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>

        <input
          className="w-full p-2 mb-3 rounded border border-gray-700 bg-gray-800 outline-none"
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 rounded border border-gray-700 bg-gray-800 outline-none"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 rounded border border-gray-700 bg-gray-800 outline-none"
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-800"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        )}

        <select
          className="w-full mb-3 p-2 rounded border border-gray-700 bg-gray-800 outline-none"
          value={aliadoId ?? ""}
          onChange={(e) => setAliadoId(Number(e.target.value))}
          disabled={!!initialAliadoId}
        >
          <option value="" disabled>Selecciona un aliado</option>
          {aliados.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <select
          className="w-full mb-4 p-2 rounded border border-gray-700 bg-gray-800 outline-none"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          disabled={!aliadoId}
        >
          <option value="" disabled>
            {categories.length === 0 ? "No hay categorías disponibles" : "Selecciona una categoría"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
