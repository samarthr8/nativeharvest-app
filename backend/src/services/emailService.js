const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ---------------------------------------------------
   🧾 Generate Invoice PDF (NEW)
--------------------------------------------------- */
function generateInvoice(order) {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../../temp-${order.order_id}.pdf`);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("NativeHarvest Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.order_id}`);
    doc.text(`Customer: ${order.customer_name || ""}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Total Amount: ₹${order.total_amount}`);
    doc.text(`Payment Status: PAID`);
    doc.moveDown();

    doc.text("Thank you for shopping with NativeHarvest 🌾");

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

/* ---------------------------------------------------
   📧 Customer Order Confirmation (UPDATED)
--------------------------------------------------- */
async function sendOrderConfirmation(order) {

  const invoicePath = await generateInvoice(order);

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
    `,
    attachments: [
      {
        filename: `Invoice-${order.order_id}.pdf`,
        path: invoicePath
      }
    ]
  };

  await transporter.sendMail(mailOptions);

  fs.unlinkSync(invoicePath);
}

/* ---------------------------------------------------
   🏢 Admin Notification Email (NEW)
--------------------------------------------------- */
async function sendAdminNotification(order) {

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🛒 New Paid Order - ${order.order_id}`,
    html: `
      <h3>New Paid Order Received</h3>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Customer:</strong> ${order.customer_name || ""}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Total:</strong> ₹${order.total_amount}</p>
      <br/>
      <p>Please prepare the order for shipment.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

/* ---------------------------------------------------
   🚚 Shipment Notification (NEW)
--------------------------------------------------- */
async function sendShipmentNotification(order) {

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Your Order ${order.order_id} Has Been Shipped`,
    html: `
      <h2>Your Order Has Been Shipped 🚚</h2>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p>Your order is on its way!</p>
      <p>You can track your order here:</p>
      <a href="https://nativeharvest.store/order/${order.order_id}">
        Track Order
      </a>
      <br/><br/>
      <p>Thank you for shopping with NativeHarvest 🌾</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOrderConfirmation,
  sendAdminNotification,
  sendShipmentNotification
};
