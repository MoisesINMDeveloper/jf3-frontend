import type { Product } from "../../constant/data";
import Button from "../atoms/common/Button";
import Description from "../atoms/common/Description";
import ImageProduct from "../atoms/common/ImageProduct";
import Price from "../atoms/common/Price";
import { motion } from "framer-motion";

const ProductDetail = ({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: () => void;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        rotateX: 2,
        rotateY: -2,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 12,
      }}
      className="
        relative flex flex-col justify-between items-center
        w-full max-w-[340px] sm:max-w-[360px] md:max-w-[380px]
        p-5 rounded-3xl bg-black/30 border border-secundary
        backdrop-blur-xl overflow-hidden shadow-lg
        hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
        hover:border-secundary/60
        transition-all duration-500 ease-in-out
        mx-auto
      "
    >
      {/* Resplandor de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-secundary/20 via-transparent to-fourth/20 opacity-40 blur-2xl pointer-events-none" />

      {/* Imagen del producto */}
      <div className="relative w-full h-48 sm:h-56 md:h-60 lg:h-64 mb-5 rounded-2xl overflow-hidden shadow-md">
        <ImageProduct images={product.images} alt={product.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Título y precio */}
      <div className="w-full flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-white text-lg font-semibold tracking-wide">
          {product.title}
        </h1>
        <div className="flex flex-row items-end w-full justify-center mt-1">
          <Price price={product.price} />
        </div>
      </div>

      {/* Descripción */}
      <div className="text-center mb-6 px-2 relative z-10">
        <Description
          text={product.description}
          color="text-gray-300 text-sm leading-relaxed"
        />
      </div>

      {/* Botón */}
      <Button
        label="Agregar pedido"
        onClick={onAddToCart}
        className="w-full py-2.5 rounded-xl 
          bg-gradient-to-r from-secundary to-fourth 
          text-white font-semibold text-base shadow-md
          transition-all duration-300 
          hover:shadow-[0_0_15px_var(--tw-gradient-to)]
          hover:brightness-110 active:scale-95"
      />
    </motion.div>
  );
};

export default ProductDetail;
