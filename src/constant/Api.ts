import axios, { type AxiosResponse } from "axios";

const API_URL = "http://localhost:3000";

//----------------- TYPES -----------------//

// Admin
export interface Admin {
  id: number;
  username: string;
  password: string;
}

// Aliado
export interface Category {
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
  category: Category;
}

export interface Aliado {
  id: number;
  name: string;
  image: string;
  categories: Category[];
  products: Product[];
  orders: any[];
}


// Paydate
export interface Paydate {
  id: number;
  bank: string;
  code: string;
  cedula: string;
  phone: string;
}

// DeliveryOption
export interface DeliveryOption {
  id: number;
  name: string;
  fee: number;
  aliadoId: number;
}

// Payment
export interface Payment {
  id: number;
  method: string;
  amount: number;
  reference?: string;
  verified: boolean;
  status: string;
  orderId: number;
}

// Order
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: number;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  status: OrderStatus;
  aliadoId: number;
}

// OrderItem
export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  orderId: number;
}

//----------------- HELPERS -----------------//
const getTokenHeader = () => {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

//----------------- ADMIN -----------------//
export const createAdmin = async (data: { username: string; password: string }): Promise<Admin> => {
  const response: AxiosResponse<Admin> = await axios.post(`${API_URL}/admin/create`, data);
  return response.data;
};

export const getAdminByUsername = async (username: string): Promise<Admin> => {
  const response: AxiosResponse<Admin> = await axios.get(`${API_URL}/admin/exists/${username}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const verifyAdminPassword = async (data: { username: string; password: string }): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.post(`${API_URL}/admin/verify`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const updateAdmin = async (id: number, data: Partial<{ username: string; password: string }>): Promise<Admin> => {
  const response: AxiosResponse<Admin> = await axios.put(`${API_URL}/admin/update/${id}`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const deleteAdmin = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/admin/delete/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

//----------------- ALIADOS -----------------//
export const getAliados = async (): Promise<{ aliados: Aliado[] }> => {
  const response = await axios.get(`${API_URL}/aliado`);
  return response.data;
};


export const getAliadoById = async (id: number): Promise<Aliado> => {
  const response: AxiosResponse<Aliado> = await axios.get(`${API_URL}/aliado/${id}`);
  return response.data;
};

export const createAliado = async (data: { name: string; image: string }): Promise<Aliado> => {
  const response: AxiosResponse<Aliado> = await axios.post(`${API_URL}/aliado`, data, { headers: getTokenHeader() });
  return response.data;
};

export const updateAliado = async (id: number, data: Partial<{ name: string; image: string }>): Promise<Aliado> => {
  const response: AxiosResponse<Aliado> = await axios.put(`${API_URL}/aliado/${id}`, data, { headers: getTokenHeader() });
  return response.data;
};

export const deleteAliado = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/aliado/${id}`, { headers: getTokenHeader() });
  return response.data;
};

//----------------- CATEGORÍAS -----------------//
export const getAllCategories = async (): Promise<
  { id: number; name: string; aliadoId: number }[]
> => {
  const response = await axios.get(`${API_URL}/category`);
  // Si el backend devuelve un objeto { categories: [...] }
  return Array.isArray(response.data)
    ? response.data
    : response.data.categories || response.data.data || [];
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response: AxiosResponse<Category> = await axios.get(`${API_URL}/category/${id}`);
  return response.data;
};

export const createCategory = async (name: string, aliadoId: number) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, aliadoId }),
  });
  return response.json();
};


export const updateCategory = async (
  id: number,
  data: { name: string; aliadoId: number }
): Promise<Category> => {
  const response: AxiosResponse<Category> = await axios.put(
    `${API_URL}/category/${id}`,
    data,
    { headers: getTokenHeader() }
  );
  return response.data;
};


export const deleteCategory = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/category/${id}`, { headers: getTokenHeader() });
  return response.data;
};

//----------------- PRODUCTOS -----------------//
export const getAllProducts = async (): Promise<Product[]> => {
  const response: AxiosResponse<Product[]> = await axios.get(`${API_URL}/producto`);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response: AxiosResponse<Product> = await axios.get(`${API_URL}/producto/${id}`);
  return response.data;
};

export const createProduct = async (data: {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
  aliadoId: number;
}): Promise<Product> => {
  const response: AxiosResponse<Product> = await axios.post(`${API_URL}/producto`, data, { headers: getTokenHeader() });
  return response.data;
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
  const response: AxiosResponse<Product> = await axios.put(`${API_URL}/producto/${id}`, data, { headers: getTokenHeader() });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/producto/${id}`, { headers: getTokenHeader() });
  return response.data;
};

//----------------- PAYDATES -----------------//
export const getAllPaydates = async (): Promise<Paydate[]> => {
  const response: AxiosResponse<Paydate[]> = await axios.get(`${API_URL}/paydates`);
  return response.data;
};

export const getPaydateById = async (id: number): Promise<Paydate> => {
  const response: AxiosResponse<Paydate> = await axios.get(`${API_URL}/paydates/${id}`);
  return response.data;
};

export const createPaydate = async (data: Omit<Paydate, "id">): Promise<Paydate> => {
  const response: AxiosResponse<Paydate> = await axios.post(`${API_URL}/paydates`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};



export const updatePaydate = async (id: number, data: Partial<Paydate>): Promise<Paydate> => {
  const response: AxiosResponse<Paydate> = await axios.put(`${API_URL}/paydates/${id}`, data, { headers: getTokenHeader() });
  return response.data;
};

export const deletePaydate = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/paydates/${id}`, { headers: getTokenHeader() });
  return response.data;
};

//----------------- DELIVERY -----------------//
export const getAllDeliveryOptions = async (): Promise<DeliveryOption[]> => {
  const response: AxiosResponse<DeliveryOption[]> = await axios.get(`${API_URL}/delivery`, { headers: getTokenHeader() });
  return response.data;
};

export const getDeliveryOptionById = async (id: number): Promise<DeliveryOption> => {
  const response: AxiosResponse<DeliveryOption> = await axios.get(`${API_URL}/delivery/${id}`, { headers: getTokenHeader() });
  return response.data;
};

export const createDeliveryOption = async (data: Omit<DeliveryOption, "id">): Promise<DeliveryOption> => {
  const response: AxiosResponse<DeliveryOption> = await axios.post(`${API_URL}/delivery`, data, { headers: getTokenHeader() });
  return response.data;
};

export const updateDeliveryOption = async (id: number, data: Partial<DeliveryOption>): Promise<DeliveryOption> => {
  const response: AxiosResponse<DeliveryOption> = await axios.put(`${API_URL}/delivery/${id}`, data, { headers: getTokenHeader() });
  return response.data;
};

export const deleteDeliveryOption = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/delivery/${id}`, { headers: getTokenHeader() });
  return response.data;
};
//----------------- PAYMENTS -----------------//
export const getAllPayments = async (): Promise<Payment[]> => {
  const response: AxiosResponse<Payment[]> = await axios.get(`${API_URL}/payment`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const getPaymentById = async (id: number): Promise<Payment> => {
  const response: AxiosResponse<Payment> = await axios.get(`${API_URL}/payment/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const createPayment = async (data: {
  method: string;
  amount: number;
  reference?: string;
  orderId: number;
}): Promise<Payment> => {
  const response: AxiosResponse<Payment> = await axios.post(`${API_URL}/payment`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const updatePayment = async (
  id: number,
  data: Partial<Payment>
): Promise<Payment> => {
  const response: AxiosResponse<Payment> = await axios.put(`${API_URL}/payment/${id}`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const deletePayment = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/payment/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

//----------------- ORDERS -----------------//
export const getAllOrders = async (): Promise<Order[]> => {
  const response: AxiosResponse<Order[]> = await axios.get(`${API_URL}/order`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const response: AxiosResponse<Order> = await axios.get(`${API_URL}/order/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const createOrder = async (data: {
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  aliadoId: number;
  status?: OrderStatus;
}): Promise<Order> => {
  const response: AxiosResponse<Order> = await axios.post(`${API_URL}/order`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const updateOrder = async (
  id: number,
  data: Partial<{ clientName: string; clientPhone: string; totalAmount: number; status: OrderStatus }>
): Promise<Order> => {
  const response: AxiosResponse<Order> = await axios.put(`${API_URL}/order/${id}`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const deleteOrder = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/order/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

//----------------- ORDER ITEMS -----------------//
export const getAllOrderItems = async (): Promise<OrderItem[]> => {
  const response: AxiosResponse<OrderItem[]> = await axios.get(`${API_URL}/orderItem`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const getOrderItemById = async (id: number): Promise<OrderItem> => {
  const response: AxiosResponse<OrderItem> = await axios.get(`${API_URL}/orderItem/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const createOrderItem = async (data: {
  quantity: number;
  price: number;
  productId: number;
  orderId: number;
}): Promise<OrderItem> => {
  const response: AxiosResponse<OrderItem> = await axios.post(`${API_URL}/orderItem`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const updateOrderItem = async (
  id: number,
  data: Partial<{ quantity: number; price: number }>
): Promise<OrderItem> => {
  const response: AxiosResponse<OrderItem> = await axios.put(`${API_URL}/orderItem/${id}`, data, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const deleteOrderItem = async (id: number): Promise<{ success: boolean }> => {
  const response: AxiosResponse<{ success: boolean }> = await axios.delete(`${API_URL}/orderItem/${id}`, {
    headers: getTokenHeader(),
  });
  return response.data;
};

export const loginAdmin = async (username: string, password: string): Promise<{ token: string }> => {
  const response: AxiosResponse<{ token: string }> = await axios.post(`${API_URL}/admin/login`, { username, password });
  return response.data;
};
