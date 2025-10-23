import { type Product } from "./administration-products";

interface ProductListProps {
  products?: Product[];
  handleDelete: (productId: number) => Promise<void>;
  handleUpdate: (product: Product) => void;
}

const ProductList = ({ products = [], handleDelete, handleUpdate }: ProductListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between items-center p-3 hover:scale-105 transition-transform duration-300"
        >
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div className="flex flex-col items-center text-center mt-2">
            <h3 className="font-bold text-white text-lg">{product.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-3 mt-1">{product.description}</p>
            <p className="font-semibold text-white mt-1">${product.price}</p>
          </div>

          <div className="flex gap-2 mt-3 w-full">
            <button
              onClick={() => handleUpdate(product)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors text-white py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
