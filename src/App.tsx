import { Routes, Route } from "react-router";

import CustomerLayout from "./layouts/CustomerLayout";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import Cart from "./pages/customer/Cart";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/customer/Checkout";

function App() {
  return (
    <Routes>

      <Route element={<CustomerLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="*" element={<NotFound />} />

      </Route>

    </Routes>
  );
}

export default App;
