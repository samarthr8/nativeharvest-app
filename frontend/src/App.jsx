import { Routes, Route, useLocation } from "react-router-dom";

import AnnouncementBar from "./components/layout/AnnouncementBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

/* Public pages */
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import ProductDetail from "./pages/ProductDetail";

/* Admin pages */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  const location = useLocation();

  return (
    <>
      <AnnouncementBar />
      <Header />

      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/order/:orderId" element={<OrderTracking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
