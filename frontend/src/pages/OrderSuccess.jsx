import { useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();

  const startPayment = async () => {
    try {
      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });

      const payData = await payRes.json();

      const options = {
        key: payData.key,
        amount: payData.amount_paise,
        currency: payData.currency,
        name: "NativeHarvest",
        description: "Farm Fresh Products",
        order_id: payData.razorpay_order_id,
        handler: function () {
          alert("Payment successful!");
        },
        theme: {
          color: "#2f6f4e"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div>
      <h2>Order Placed Successfully 🎉</h2>
      <p>Your Order ID:</p>
      <h3>{orderId}</h3>

      <button onClick={startPayment} style={{ marginTop: "20px" }}>
        Pay Now
      </button>
    </div>
  );
};

export default OrderSuccess;


