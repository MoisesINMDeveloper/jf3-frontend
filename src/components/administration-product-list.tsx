import { type Product } from "./administration-products";

interface ProductListProps {
  products?: Product[] | any; // puede llegar undefined o con otra estructura
  handleDelete: (productId: number) => Promise<void>;
  handleUpdate: (product: Product) => void;
}

const ProductList = ({ products = [], handleDelete, handleUpdate }: ProductListProps) => {
  // Si products viene en una estructura tipo { data: [...] }
  const list = Array.isArray(products) ? products : products?.data || [];


  return (
    <div className="grid grid-cols-3 gap-4">
      {list.map((product: Product, index: any) => (
        <div
          key={`${product.id}-${index}`} // 🔑 key única
          className="border p-2 rounded flex flex-col items-center gap-2 bg-gray-800 text-white"
        >
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
          )}

          <h3 className="font-bold">{product.title}</h3>
          <p className="text-sm text-gray-300">{product.description}</p>
          <p className="font-semibold">${product.price}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleUpdate(product)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))
      }
    </div>
  );
};

export default ProductList;
