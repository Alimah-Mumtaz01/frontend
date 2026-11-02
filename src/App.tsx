import { Routes, Route } from "react-router";

import CustomerLayout from "./layouts/CustomerLayout";

import Home from "./pages/customer/Home";
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
