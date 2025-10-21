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
    <div className="flex justify-center">
      {products.map((product: Product) => (
        <div className="my-4 w-full max-w-sm sm:max-w-[280px]" key={product.id}>
          <ProductDetail product={product} onAddToCart={() => addToCart(product)} />
        </div>
      ))}
    </div>
  );
};

export default Menu;
