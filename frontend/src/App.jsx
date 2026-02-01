import { Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  return (
    <>
      <nav>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderSuccess />} />
        </Routes>
      </div>
    </>
  );
};

export default App;


