import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AnnouncementBar from "./components/layout/AnnouncementBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WhatsAppWidget from "./components/layout/WhatsAppWidget";
import FloatingReviewButton from "./components/layout/FloatingReviewButton";

/* Public pages */
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import ProductDetail from "./pages/ProductDetail";

/* Footer & Floating Pages */
import Reviews from "./pages/Reviews";
import Gallery from "./pages/Gallery";
import Blogs from "./pages/Blogs";
import Shipping from "./pages/Shipping";
import Refund from "./pages/Refund";

/* Admin pages (UPDATED) */
import AdminLogin from "./pages/admin/AdminLogin";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminOrders from "./pages/admin/AdminOrders";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <AnnouncementBar />
      <Header />

      <div key={location.pathname} className="page-transition">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/refund" element={<Refund />} />
          
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/order/:orderId" element={<OrderTracking />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<DashboardHome />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>

      <WhatsAppWidget />
      <FloatingReviewButton />
      <Footer />
    </>
  );
};

export default App;