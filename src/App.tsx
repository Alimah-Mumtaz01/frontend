import { Routes, Route } from "react-router";

import CustomerLayout from "./layouts/CustomerLayout";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>

      {/* Customer Layout */}
      <Route element={<CustomerLayout />}>

        {/* Halaman Home */}
        <Route
          path="/"
          element={<Home />}
        />
        {/* Produk */}
        <Route path="/products" element={<Products />} />

      </Route>

      {/* Halaman 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;
