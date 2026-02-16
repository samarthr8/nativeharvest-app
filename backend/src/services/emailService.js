const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOrderConfirmation(order) {

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - ${order.order_id}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
      <p><strong>Payment Status:</strong> PAID</p>
      <br/>
      <p>You can track your order here:</p>
      <a href="https://nativeharvest.store/order/${order.order_id}">
        Track Order
      </a>
      <br/><br/>
      <p>Thank you for supporting NativeHarvest 🌾</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOrderConfirmation };
