import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
	  <Route path="/admin/login" element={<AdminLogin />} />
	  <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

