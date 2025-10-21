import type { Product } from "../../constant/data";
import Button from "../atoms/common/Button";
import Description from "../atoms/common/Description";
import ImageProduct from "../atoms/common/ImageProduct";
import Price from "../atoms/common/Price";
import TitleProduct from "../atoms/common/Title";

const ProductDetail = ({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: () => void;
}) => {
  return (
    <div className="flex flex-col justify-between items-center w-full max-w-[300px] h-full p-5 border-2 border-primary text-white rounded-lg bg-gray-900 shadow-md">
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-row justify-between items-center mb-4 w-full">
          <TitleProduct title={product.title} />
          <Price price={product.price} />
        </div>
        <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 mb-3">
          <ImageProduct images={product.images} alt={product.title} />
        </div>
        <Description text={product.description} />
      </div>
      <Button label="Agregar pedido" onClick={onAddToCart} />
    </div>
  );
};

export default ProductDetail;
