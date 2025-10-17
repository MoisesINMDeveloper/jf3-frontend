import { useState } from "react";
import { type Product } from "./administration-products";

interface UpdateProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const UpdateProductModal = ({ product, onClose, onSave }: UpdateProductModalProps) => {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [images, setImages] = useState(product.images);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imagePromises = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );
      Promise.all(imagePromises).then(setImages);
    }
  };

  const handleSave = () => onSave({ ...product, title, description, price, images });

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black border-primary border-2 w-[350px] p-4 rounded text-white">
        <h2 className="text-xl font-bold mb-4">Actualizar Producto</h2>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`img-${idx}`} className="w-16 h-16 object-cover" />
        ))}
        <button onClick={onClose}>Cancelar</button>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default UpdateProductModal;
