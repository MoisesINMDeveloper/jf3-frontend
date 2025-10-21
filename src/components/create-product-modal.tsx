import { useState } from "react";
import type { Product, Category } from "./administration-products";
import { createProduct } from "../constant/Api";

interface CreateProductModalProps {
  aliadoId: number;
  categories: Category[];
  onClose: () => void;
  onSave: (newProduct: Product) => void;
}

const CreateProductModal = ({ aliadoId, categories, onClose, onSave }: CreateProductModalProps) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Convertir imagen a Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleSave = async () => {
    if (!title || !price || !categoryId) return alert("Completa todos los campos");
    setLoading(true);

    try {
      // Convertir todas las imágenes a Base64
      const base64Images = await Promise.all(images.map(fileToBase64));

      const savedProduct = await createProduct({
        title,
        price,
        description,
        images: base64Images,
        categoryId,
        aliadoId,
      });

      onSave(savedProduct);
      onClose();
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error creando producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded w-96 flex flex-col gap-4">
        <h2 className="text-white text-xl">Crear Producto</h2>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 text-white"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        />

        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="" disabled>
            Selecciona categoría
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="text-white"
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((img, index) => (
            <img
              key={img.name + index}
              src={URL.createObjectURL(img)}
              alt={`Preview ${index}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-redButton text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-greenButton text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
