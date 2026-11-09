import { Routes, Route, Navigate } from "react-router";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import PublicReviews from "./pages/customer/reviews/PublicReviews";

import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import MyOrders from "./pages/customer/orders/MyOrders";

import Dashboard from "./pages/admin/Dashboard";
import AdminNotFound from "./pages/admin/AdminNotFound";

import ProductList from "./pages/admin/products/ProductList";
import ProductForm from "./pages/admin/products/ProductForm";
import ProductDetails from "./pages/admin/products/ProductDetail";

import VariantList from "./pages/admin/variants/VariantList";
import VariantForm from "./pages/admin/variants/VariantForm";

// ADMIN ORDERS
import OrderList from "./pages/admin/orders/OrderList";
import OrderDetail from "./pages/admin/orders/OrderDetail";

// ADMIN CUSTOMERS
import CustomerList from "./pages/admin/customers/CustomerList";
import CustomerDetail from "./pages/admin/customers/CustomerDetail";

// ADMIN REVIEWS
import AdminReviews from "./pages/admin/reviews/AdminReviews";

import Reports from "./pages/admin/Reports";

import NotFound from "./pages/NotFound";

function App() {
    return (
        <Routes>

            {/* ==============================
                CUSTOMER ROUTES
            ============================== */}

            <Route element={<CustomerLayout />}>

                <Route path="/" element={<Home />} />

                <Route path="/products" element={<Products />} />

                <Route
                    path="/products/:id_product"
                    element={<ProductDetail />}
                />

                <Route path="/about" element={<About />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/reviews" element={<PublicReviews />} />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                {/* ==============================
                    NOT FOUND
                ============================== */}

                <Route path="*" element={<NotFound />} />

            </Route>

            {/* ==============================
                ADMIN ROUTES
            ============================== */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={<Navigate to="/admin/dashboard" replace />}
                />

                {/* DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                {/* ==============================
                    CRUD PRODUCT
                ============================== */}

                <Route
                    path="products"
                    element={<ProductList />}
                />

                <Route
                    path="products/add"
                    element={<ProductForm />}
                />

                <Route
                    path="products/edit/:id_product"
                    element={<ProductForm />}
                />

                <Route
                    path="products/detail/:id_product"
                    element={<ProductDetails />}
                />

                {/* ==============================
                    CRUD VARIANT
                ============================== */}

                <Route
                    path="variants"
                    element={<VariantList />}
                />

                <Route
                    path="variants/add"
                    element={<VariantForm />}
                />

                <Route
                    path="variants/edit/:id_varian"
                    element={<VariantForm />}
                />

                {/* ==============================
                    KELOLA PESANAN
                ============================== */}

                <Route path="orders/*">
                    <Route index element={<OrderList />} />
                    <Route
                        path="detail/:id_order"
                        element={<OrderDetail />}
                    />
                </Route>

                {/* ==============================
                    KELOLA PELANGGAN
                ============================== */}

                <Route path="customers/*">
                    <Route index element={<CustomerList />} />
                    <Route
                        path="detail/:id_user"
                        element={<CustomerDetail />}
                    />
                </Route>

                {/* ==============================
                    KELOLA ULASAN
                ============================== */}

                <Route
                    path="reviews"
                    element={<AdminReviews />}
                />

                {/* ==============================
                    LAPORAN
                ============================== */}

                <Route
                    path="reports"
                    element={<Reports />}
                />

                {/* ==============================
                    HALAMAN TIDAK DITEMUKAN ADMIN
                ============================== */}

                <Route
                    path="*"
                    element={<AdminNotFound />}
                />

            </Route>

        </Routes>
    );
}

export default App;