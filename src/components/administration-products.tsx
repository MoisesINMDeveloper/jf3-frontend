"use client";

import { useEffect, useState } from "react";
import { getAliados, deleteProduct } from "../constant/Api";
import CategoryFilter from "./administration-category-filter";
import ProductList from "./administration-product-list";
import CreateProductModal from "./create-product-modal";
import UpdateProductModal from "./update-product-modal";

export interface Category { id: number; name: string; aliadoId: number; }
export interface Product { id: number; title: string; price: number; images: string[]; description: string; categoryId: number; aliadoId: number; category: Category; }
interface Aliado { id: number; name: string; image: string; categories: Category[]; products: Product[]; }

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

  useEffect(() => {
    if (!selectedAliadoId) { 
      setCategories([]); 
      setProducts([]); 
      setFilteredProducts([]); 
      return; 
    }
    const aliadoSeleccionado = aliados.find(a => a.id === selectedAliadoId);
    if (aliadoSeleccionado) { 
      setCategories(aliadoSeleccionado.categories || []); 
      setProducts(aliadoSeleccionado.products || []); 
      setFilteredProducts(aliadoSeleccionado.products || []); 
    }
  }, [selectedAliadoId, aliados]);

  const handleFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    setFilteredProducts(categoryId === null ? products : products.filter(p => p.categoryId === categoryId));
  };

  const handleUpdate = (product: Product) => { setCurrentProduct(product); setIsModalOpen(true); };

  const handleDelete = async (productId: number) => {
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        setFilteredProducts(prev => prev.filter(p => p.id !== productId));
      } else { alert("No se pudo eliminar el producto"); }
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error eliminando producto");
    }
  };

  const handleModalClose = () => { setIsModalOpen(false); setCurrentProduct(null); };

  return (
    <div className="text-white p-4 flex flex-col gap-6 items-center justify-center w-full max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl text-center font-bold mb-4">Administrador de Productos</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full flex-wrap">
        <select
          value={selectedAliadoId ?? ""}
          onChange={(e) => setSelectedAliadoId(Number(e.target.value))}
          className="bg-black border border-secundary outline-none p-2 rounded min-w-[200px] text-white"
        >
          <option value="">Selecciona un aliado</option>
          {aliados.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <CategoryFilter categories={categories} activeCategory={activeCategory} handleFilter={handleFilter} />

        {selectedAliadoId && (
          <button
            className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded font-semibold"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Producto
          </button>
        )}
      </div>

      <ProductList products={filteredProducts} handleDelete={handleDelete} handleUpdate={handleUpdate} />

      {isModalOpen && currentProduct && (
        <UpdateProductModal product={currentProduct} onClose={handleModalClose} onSave={(updated) => {
          setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
          setFilteredProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
          handleModalClose();
        }} />
      )}

      {isCreateModalOpen && selectedAliadoId && (
        <CreateProductModal
          aliadoId={selectedAliadoId}
          categories={categories}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={(newProduct) => {
            setProducts(prev => [...prev, newProduct]);
            setFilteredProducts(prev => [...prev, newProduct]);
          }}
        />
      )}
    </div>
  );
};

export default PanelAdminProducts;
