import type { Product } from "../../constant/data";
import ProductDetail from "../molecules/CardProduct";

const Menu = ({
  products,
  addToCart,
}: {
  products: Product[];
  addToCart: (product: Product) => void;
}) => {
  return (
    <div
      className="flex flex-wrap justify-center items-start gap-5 
             w-full max-w-[100vw] p-4 overflow-x-hidden "
    >
      {products.map((product: Product) => (
        <ProductDetail
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product)}
        />
      ))}
    </div>
  );
};

export default Menu;
