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
      {list.length === 0 ? (
        <p className="col-span-3 text-center text-gray-500">No hay productos disponibles</p>
      ) : (
        list.map((product: Product) => (
          <div key={product.id} className="border p-2 rounded">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button
              onClick={() => handleUpdate(product)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
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
        ))
      )}
    </div>
  );
};

export default ProductList;
