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
   🧾 Generate Professional Invoice PDF (UPDATED)
--------------------------------------------------- */
function generateInvoice(order) {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ margin: 50 });

    const fontPath = path.join(__dirname, "../../fonts/NotoSans-Regular.ttf");
    doc.registerFont("NotoSans", fontPath);
    doc.font("NotoSans");

    const filePath = path.join(__dirname, `../../temp-${order.order_id}.pdf`);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    /* Header */
    doc.fontSize(22).text("NativeHarvest India", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).text("INVOICE", { align: "center" });
    doc.moveDown(1.5);

    /* Order Details */
    doc.fontSize(12);
    doc.text(`Order ID: ${order.order_id}`);
    doc.text(`Customer: ${order.customer_name || ""}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone || ""}`);
    doc.moveDown();

    /* Address Section */
    doc.text("Delivery Address:");
    doc.text(order.full_address || order.address || "");

    if (order.city || order.state || order.pincode) {
      doc.text(`${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`);
    }

    doc.moveDown();

    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();

    doc.moveDown();

    /* --- AMOUNT SECTION WITH COUPON LOGIC --- */
    const shippingFee = order.shipping_fee || 0;
    const discountAmount = order.discount_amount || 0;
    const couponCode = order.coupon_code || "";
    
    // Subtotal of just the items
    const originalSubtotal = order.total_amount - shippingFee + discountAmount;

    doc.fontSize(14).text("Order Summary", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Subtotal: ₹${originalSubtotal}`, { align: "right" });
    
    if (discountAmount > 0) {
      doc.text(`Discount (${couponCode}): -₹${discountAmount}`, { align: "right" });
    }

    doc.text(
      `Delivery Fee: ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}`, 
      { align: "right" }
    );
    
    doc.moveDown(0.5);

    doc.fontSize(14).text(`Total Amount: ₹${order.total_amount}`, {
      align: "right"
    });

    doc.moveDown(2);

    /* Footer */
    doc.fontSize(11).text(
      "Thank you for shopping with NativeHarvest 🌾",
      { align: "center" }
    );

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
  
  const shippingFee = order.shipping_fee || 0;
  const discountAmount = order.discount_amount || 0;
  const couponCode = order.coupon_code || "";
  const originalSubtotal = order.total_amount - shippingFee + discountAmount;

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - ${order.order_id}`,
    html: `
      <h2>Thank you for your order! 🌾</h2>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      
      <p><strong>Subtotal:</strong> ₹${originalSubtotal}</p>
      ${discountAmount > 0 ? `<p><strong>Discount (${couponCode}):</strong> -₹${discountAmount}</p>` : ""}
      <p><strong>Delivery Fee:</strong> ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</p>
      <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>

      <h4>Delivery Address:</h4>
      <p>
        ${order.full_address || order.address || ""}<br/>
        ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}
      </p>

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
   🏢 Admin Notification Email (UPDATED)
--------------------------------------------------- */
async function sendAdminNotification(order) {

  const shippingFee = order.shipping_fee || 0;
  const discountAmount = order.discount_amount || 0;
  const couponCode = order.coupon_code || "";
  const originalSubtotal = order.total_amount - shippingFee + discountAmount;

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🛒 New Paid Order - ${order.order_id}`,
    html: `
      <h3>New Paid Order Received</h3>

      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Customer:</strong> ${order.customer_name || ""}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone || ""}</p>

      <h4>Delivery Address:</h4>
      <p>
        ${order.full_address || order.address || ""}<br/>
        ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}
      </p>

      <p><strong>Subtotal:</strong> ₹${originalSubtotal}</p>
      ${discountAmount > 0 ? `<p><strong>Discount (${couponCode}):</strong> -₹${discountAmount}</p>` : ""}
      <p><strong>Delivery Fee:</strong> ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</p>
      <p><strong>Total:</strong> ₹${order.total_amount}</p>

      <br/>
      <p>Please prepare the order for shipment.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

/* ---------------------------------------------------
   🚚 Shipment Notification (UNCHANGED)
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

/* ---------------------------------------------------
   🎉 Delivered Notification + Marketing (UNCHANGED)
--------------------------------------------------- */
async function sendDeliveredNotification(order) {

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Delivered - ${order.order_id} 🎉`,
    html: `
      <h2>Your Order Has Been Delivered 🎉</h2>

      <p>Hi ${order.customer_name},</p>

      <p>Your order <strong>${order.order_id}</strong> has been successfully delivered.</p>

      <p>We hope you loved our products! 🌾</p>

      <p>
        Visit us again for fresh and authentic farm-made goodness.
      </p>

      <a href="https://nativeharvest.store"
         style="background:#2f6f4e;color:white;padding:10px 20px;
                text-decoration:none;border-radius:6px;display:inline-block;">
        Shop Again
      </a>

      <br/><br/>
      <p>Thank you for supporting NativeHarvest.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOrderConfirmation,
  sendAdminNotification,
  sendShipmentNotification,
  sendDeliveredNotification
};