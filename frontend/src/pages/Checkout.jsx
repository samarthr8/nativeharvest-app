import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import SEO from "../components/SEO";

const Checkout = () => {

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    full_address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);

  // --- COUPON STATES ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // --- SHIPPING & TOTAL LOGIC ---
  const SHIPPING_FEE = 80;
  const FREE_SHIPPING_THRESHOLD = 999;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  // --- FIXED: Shipping cost is now strictly evaluated against the ORIGINAL subtotal ---
  const shippingCost = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : SHIPPING_FEE;
  
  const finalTotal = subtotal === 0 ? 0 : discountedSubtotal + shippingCost;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.full_address || !form.city || !form.state || !form.pincode) {
      showToast("Please fill all address fields", "warning");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      showToast("Pincode must be 6 digits", "warning");
      return false;
    }

    return true;
  };

  // --- APPLY COUPON ---
  const applyCoupon = async () => {
    if (!couponInput) return;
    setIsApplying(true);
    setCouponMessage("");

    try {
      const res = await fetch("/api/orders/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal })
      });
      const data = await res.json();

      if (!res.ok) {
        setCouponMessage(`❌ ${data.message}`);
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        setAppliedCoupon(data.code);
        setDiscountAmount(data.discountAmount);
        setCouponMessage(`✅ ${data.message}`);
      }
    } catch (err) {
      setCouponMessage("❌ Error validating coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    setCouponMessage("");
  };

  const placeOrder = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      const combinedAddress = `
${form.full_address},
${form.city},
${form.state} - ${form.pincode}
      `.trim();

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email,
          full_address: form.full_address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          address: combinedAddress,
          coupon_code: appliedCoupon,
          items: cart.map(item => ({
            slug: item.slug,
            qty: item.qty,
            price: item.price,
            variant_key: item.variantKey || null
          }))
        })
      });

      const data = await res.json();

      if (!data.order_id) {
        showToast(data.message || "Order creation failed");
        setLoading(false);
        return;
      }

      clearCart();
      navigate(`/order-success/${data.order_id}?email=${encodeURIComponent(form.email)}`);

    } catch (err) {
      showToast("Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    fontSize: "14px"
  };

  const greenBtn = {
    background: "#2f6f4e",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    width: "100%",
    transition: "0.2s ease"
  };

  const glow = (e, on) => {
    e.target.style.boxShadow = on ? "0 0 12px rgba(47,111,78,0.4)" : "none";
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f5f7f6",
        minHeight: "100vh"
      }}
    >

      <style>
        {`
          .checkout-grid { 
            display: grid; 
            grid-template-columns: 1fr 400px; 
            gap: 40px; 
            max-width: 1100px; 
            margin: 0 auto; 
          }
          @media (max-width: 850px) {
            .checkout-grid { 
              grid-template-columns: 1fr; 
              gap: 20px; 
            }
          }
        `}
      </style>

      <SEO
        title="Checkout | NativeHarvest India"
        description="Complete your order for farm-fresh products from NativeHarvest India."
      />

      <div className="checkout-grid">

        {/* ================= LEFT SIDE — FORM ================= */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >

          <h2 style={{ marginBottom: "25px" }}>
            Checkout
          </h2>

          <h4 style={{ marginBottom: "10px" }}>Contact Information</h4>

          <input
            name="customer_name"
            placeholder="Full Name"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleChange}
          />

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Shipping Address
          </h4>

          <textarea
            name="full_address"
            placeholder="House No, Street, Area"
            style={{ ...inputStyle, height: "80px" }}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="state"
            placeholder="State"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="pincode"
            placeholder="Pincode"
            style={inputStyle}
            onChange={handleChange}
          />

        </div>

        {/* ================= RIGHT SIDE — ORDER SUMMARY ================= */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            height: "fit-content"
          }}
        >

          <h3 style={{ marginBottom: "20px" }}>
            Order Summary
          </h3>

          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "14px"
              }}
            >
              <div>
                {item.name}
                {item.variantKey && (
                  <div style={{ fontSize: "12px", opacity: 0.6 }}>
                    {item.variantKey}
                  </div>
                )}
                × {item.qty}
              </div>
              <div>₹{item.price * item.qty}</div>
            </div>
          ))}

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* COUPON INPUT SECTION */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                disabled={appliedCoupon !== null}
                style={{ ...inputStyle, marginBottom: 0, textTransform: "uppercase" }} 
              />
              {appliedCoupon ? (
                <button 
                  onClick={removeCoupon} 
                  style={{ background: "#d9534f", color: "white", border: "none", padding: "0 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Remove
                </button>
              ) : (
                <button 
                  onClick={applyCoupon} 
                  disabled={isApplying || !couponInput} 
                  style={{ background: "#2f6f4e", color: "white", border: "none", padding: "0 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {isApplying ? "..." : "Apply"}
                </button>
              )}
            </div>
            {couponMessage && (
              <div style={{ fontSize: "12px", marginTop: "8px", color: appliedCoupon ? "green" : "#d9534f", fontWeight: "500" }}>
                {couponMessage}
              </div>
            )}
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* SUBTOTAL & DISCOUNT & DELIVERY */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {appliedCoupon && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#2f6f4e", fontWeight: "bold" }}>
              <span>Discount ({appliedCoupon})</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
            <span>Delivery Fee</span>
            <span style={{ color: shippingCost === 0 ? "green" : "inherit", fontWeight: shippingCost === 0 ? "bold" : "normal" }}>
              {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
            </span>
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "18px",
              marginBottom: "25px" 
            }}
          >
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>

          {/* BUTTON AT THE BOTTOM OF ORDER SUMMARY */}
          <button
            onClick={placeOrder}
            disabled={loading || cart.length === 0}
            style={greenBtn}
            onMouseOver={(e)=>glow(e,true)}
            onMouseOut={(e)=>glow(e,false)}
          >
            {loading ? "Processing..." : `Proceed to Payment • ₹${finalTotal}`}
          </button>
          
          <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "#666" }}>
            🔒 You will be redirected to securely complete your payment.
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;