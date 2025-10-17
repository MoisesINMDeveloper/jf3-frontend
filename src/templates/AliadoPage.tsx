import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Menu from "../components/organisms/Menu";
import { useCart } from "../hooks/useCart";
import { getAliados } from "../constant/Api";
import type { Product } from "../constant/data";

const AliadoPage = () => {
  const { id } = useParams(); // ✅ Lee el id desde la URL dinámica
  const aliadoId = Number(id);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAliados(); // trae todos los aliados con sus productos
        const aliado = data.aliados.find((a: any) => a.id === aliadoId);
        if (aliado && aliado.products) {
          setProducts(aliado.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos del aliado:", error);
      }
    };

    if (aliadoId) fetchProducts();
  }, [aliadoId]);

  return (
    <section className="flex flex-col items-center pt-20 w-full">
      <h2 className="text-2xl font-bold mb-6 text-secundary">Productos del aliado</h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Menu key={product.id} products={[product]} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-center col-span-full">
            No hay productos disponibles para este aliado.
          </p>
        )}
      </div>
    </section>
  );
};

export default AliadoPage;
