import { useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div>
      <h2>Order Placed Successfully 🎉</h2>
      <p>Your Order ID:</p>
      <h3>{orderId}</h3>
    </div>
  );
};

export default OrderSuccess;

