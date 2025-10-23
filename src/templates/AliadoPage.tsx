import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Menu from "../components/organisms/Menu";
import { useCart } from "../hooks/useCart";
import { getAliados } from "../constant/Api";
import type { Product } from "../constant/data";

const AliadoPage = () => {
  const { id } = useParams();
  const aliadoId = Number(id);
  const [products, setProducts] = useState<Product[]>([]);
  const [aliadoName, setAliadoName] = useState<string>(""); // ✅ Nuevo estado para el nombre
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAliados();
        const aliado = data.aliados.find((a: any) => a.id === aliadoId);

        if (aliado) {
          setAliadoName(aliado.name || ""); // ✅ Guardar el nombre del aliado
          if (aliado.products) {
            setProducts(aliado.products);
          } else {
            setProducts([]);
          }
        } else {
          setAliadoName("");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos del aliado:", error);
      }
    };

    if (aliadoId) fetchProducts();
  }, [aliadoId]);

  return (
    <section className="flex flex-col items-center pt-16 w-full">
      <h2 className="text-4xl md:text-3xl lg:text-4xl font-bold mb-6 text-secundary text-center">
        {aliadoName ? `${aliadoName}` : "Productos del aliado"}
      </h2>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-auto gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Menu key={product.id} products={[product]} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No hay productos disponibles para este aliado.
          </p>
        )}
      </div>
    </section>
  );
};

export default AliadoPage;
