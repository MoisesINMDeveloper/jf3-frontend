"use client";

import { useEffect, useState } from "react";
import { getAliados } from "../constant/Api";
import CategoryFilter from "./administration-category-filter";
import ProductList from "./administration-product-list";
import UpdateProductModal from "./update-product-modal";
import CreateProductModal from "./create-product-modal";

interface Category {
  id: number;
  name: string;
  aliadoId: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  description: string;
  categoryId: number;
  aliadoId: number;
  category: {
    id: number;
    name: string;
    aliadoId: number;
  };
}


interface Aliado {
  id: number;
  name: string;
  image: string;
  categories: Category[];
  products: Product[];
  orders: any[];
}

const PanelAdminProducts = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [selectedAliadoId, setSelectedAliadoId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // 🔹 Cargar todos los aliados al inicio
  useEffect(() => {
    const fetchAliados = async () => {
      try {
        const data = await getAliados();
        setAliados(data.aliados);
      } catch (error) {
        console.error("Error fetching aliados:", error);
      }
    };
    fetchAliados();
  }, []);

  // 🔹 Actualizar categorías y productos cuando se selecciona un aliado
  useEffect(() => {
    if (!selectedAliadoId) {
      setCategories([]);
      setProducts([]);
      setFilteredProducts([]);
      return;
    }

    const aliadoSeleccionado = aliados.find((a) => a.id === selectedAliadoId);

    if (aliadoSeleccionado) {
      setCategories(aliadoSeleccionado.categories);
      setProducts(aliadoSeleccionado.products);
      setFilteredProducts(aliadoSeleccionado.products);
    }
  }, [selectedAliadoId, aliados]);

  // 🔹 Filtrar productos por categoría
  const handleFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    if (categoryId === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.categoryId === categoryId));
    }
  };

  const handleUpdate = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    // Aquí iría tu lógica de eliminación (deleteProduct)
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setFilteredProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <div className="text-white p-4 flex flex-col gap-6 items-center justify-center">
      <h1 className="text-2xl text-center">Administrador de Productos</h1>

      {/* 🔹 Selector de Aliado */}
      <div className="flex gap-4">
        <select
          value={selectedAliadoId ?? ""}
          onChange={(e) => setSelectedAliadoId(Number(e.target.value))}
          className="bg-black border border-primary p-2 rounded"
        >
          <option value="">Selecciona un aliado</option>
          {aliados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* 🔹 Filtro de Categoría */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          handleFilter={handleFilter}
        />
      </div>

      {/* 🔹 Lista de Productos */}
      <ProductList
        products={filteredProducts}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />

      {isModalOpen && currentProduct && (
        <UpdateProductModal
          product={currentProduct}
          onClose={handleModalClose}
          onSave={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setFilteredProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            handleModalClose();
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateProductModal
          aliados={aliados}
          initialAliadoId={selectedAliadoId ?? undefined}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={(newProduct) => {
            setProducts([...products, newProduct]);
            setFilteredProducts([...filteredProducts, newProduct]);
          }}
        />
      )}
    </div>
  );
};

export default PanelAdminProducts;
