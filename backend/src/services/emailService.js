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
   🎨 NEW: Base HTML Template for Premium Branding
--------------------------------------------------- */
function getBaseEmailTemplate(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f7f6; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #2f6f4e; padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .footer { background-color: #f9fcfb; padding: 20px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee; }
        .button { display: inline-block; background-color: #2f6f4e; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 16px; margin: 20px 0; }
        .table-summary { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; }
        .table-summary th, .table-summary td { padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right; }
        .table-summary th { text-align: left; color: #666666; font-weight: normal; }
        .table-summary .total-row td { font-weight: bold; font-size: 18px; color: #2f6f4e; border-bottom: none; border-top: 2px solid #eeeeee; }
        .table-summary .total-row th { font-weight: bold; font-size: 16px; color: #333; border-bottom: none; border-top: 2px solid #eeeeee; }
        .card { background-color: #f9fcfb; padding: 20px; border-radius: 8px; border: 1px solid #e2eee8; margin: 20px 0; }
        .card h3 { margin-top: 0; color: #1f2d2a; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #e2eee8; padding-bottom: 10px; }
        .card p { margin: 5px 0; color: #555; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NativeHarvest</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>NativeHarvest India LLP • Bringing Bundelkhand's authenticity to your home.</p>
          <p>Chhatarpur, Madhya Pradesh</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/* ---------------------------------------------------
   🧾 Generate Professional Invoice PDF (UNCHANGED)
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

    /* --- HEADER WITH LLP & GSTIN --- */
    doc.fontSize(22).text("NativeHarvest India LLP", { align: "center" });
    doc.moveDown(0.2);
    // TODO: Replace with your actual GSTIN
    doc.fontSize(10).fillColor("#555").text("GSTIN: 23XXXXXXXXXXXXX", { align: "center" }); 
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#000").text("TAX INVOICE", { align: "center" });
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
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    /* --- AMOUNT & GST SECTION --- */
    const shippingFee = order.shipping_fee || 0;
    const discountAmount = order.discount_amount || 0;
    const couponCode = order.coupon_code || "";
    
    const originalSubtotal = order.total_amount - shippingFee + discountAmount;

    // Assuming a standard 5% Inclusive GST (2.5% CGST + 2.5% SGST)
    // Formula: Taxable Value = Total / 1.05
    const taxableValue = (originalSubtotal / 1.05).toFixed(2);
    const totalGst = (originalSubtotal - taxableValue).toFixed(2);
    const halfGst = (totalGst / 2).toFixed(2);

    doc.fontSize(14).text("Order Summary", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Taxable Value: ₹${taxableValue}`, { align: "right" });
    doc.fontSize(10).fillColor("#555")
       .text(`CGST (2.5%): ₹${halfGst}`, { align: "right" })
       .text(`SGST (2.5%): ₹${halfGst}`, { align: "right" });
    
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#000").text(`Subtotal (Inc. Taxes): ₹${originalSubtotal}`, { align: "right" });
    
    if (discountAmount > 0) {
      doc.text(`Discount (${couponCode}): -₹${discountAmount}`, { align: "right" });
    }

    doc.text(
      `Delivery Fee: ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}`, 
      { align: "right" }
    );
    
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Total Amount: ₹${order.total_amount}`, { align: "right" });

    doc.moveDown(2);

    /* Footer */
    doc.fontSize(11).text("Thank you for shopping with NativeHarvest 🌾", { align: "center" });

    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

/* ---------------------------------------------------
   📧 Customer Order Confirmation (UPDATED UI)
--------------------------------------------------- */
async function sendOrderConfirmation(order) {

  const invoicePath = await generateInvoice(order);
  
  const shippingFee = order.shipping_fee || 0;
  const discountAmount = order.discount_amount || 0;
  const couponCode = order.coupon_code || "";
  const originalSubtotal = order.total_amount - shippingFee + discountAmount;

  const htmlContent = `
    <h2 style="color: #1f2d2a; margin-top: 0;">Thank you for your order! 🌾</h2>
    <p>Hi ${order.customer_name || 'there'},</p>
    <p>We're getting your farm-fresh goods ready to be shipped. We will notify you when your package is on its way.</p>
    
    <div class="card">
      <h3>Order #${order.order_id}</h3>
      <p><strong>Delivery Address:</strong><br/>
      ${order.full_address || order.address || ""}<br/>
      ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}</p>
    </div>

    <table class="table-summary">
      <tr><th>Subtotal</th><td>₹${originalSubtotal}</td></tr>
      ${discountAmount > 0 ? `<tr><th>Discount (${couponCode})</th><td style="color: #c53030;">-₹${discountAmount}</td></tr>` : ""}
      <tr><th>Delivery Fee</th><td>${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</td></tr>
      <tr class="total-row"><th>Total Amount</th><td>₹${order.total_amount}</td></tr>
    </table>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://nativeharvest.store/order/${order.order_id}" class="button">Track Your Order</a>
    </div>
  `;

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - #${order.order_id}`,
    html: getBaseEmailTemplate(htmlContent),
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
   🏢 Admin Notification Email (UPDATED UI)
--------------------------------------------------- */
async function sendAdminNotification(order) {

  const shippingFee = order.shipping_fee || 0;
  const discountAmount = order.discount_amount || 0;
  const couponCode = order.coupon_code || "";
  const originalSubtotal = order.total_amount - shippingFee + discountAmount;

  const htmlContent = `
    <h2 style="color: #1f2d2a; margin-top: 0;">🛒 New Paid Order</h2>
    <p>A new order has been placed. Please prepare the items for shipment.</p>
    
    <div class="card">
      <h3>Customer Details</h3>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Customer:</strong> ${order.customer_name || "N/A"}</p>
      <p><strong>Email:</strong> <a href="mailto:${order.email}" style="color: #2f6f4e;">${order.email}</a></p>
      <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
    </div>

    <div class="card">
      <h3>Delivery Address</h3>
      <p>
        ${order.full_address || order.address || ""}<br/>
        ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}
      </p>
    </div>

    <table class="table-summary">
      <tr><th>Subtotal</th><td>₹${originalSubtotal}</td></tr>
      ${discountAmount > 0 ? `<tr><th>Discount (${couponCode})</th><td style="color: #c53030;">-₹${discountAmount}</td></tr>` : ""}
      <tr><th>Delivery Fee</th><td>${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</td></tr>
      <tr class="total-row"><th>Total Amount</th><td>₹${order.total_amount}</td></tr>
    </table>
  `;

  const mailOptions = {
    from: `"NativeHarvest Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Order! #${order.order_id} - ₹${order.total_amount}`,
    html: getBaseEmailTemplate(htmlContent)
  };

  await transporter.sendMail(mailOptions);
}

/* ---------------------------------------------------
   🚚 Shipment Notification (UPDATED UI)
--------------------------------------------------- */
async function sendShipmentNotification(order) {

  const htmlContent = `
    <h2 style="color: #1f2d2a; margin-top: 0;">Your Order is on its Way! 🚚</h2>
    <p>Great news, ${order.customer_name || 'there'}!</p>
    <p>Your order <strong>#${order.order_id}</strong> has been shipped and is heading your way.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://nativeharvest.store/order/${order.order_id}" class="button">Track Your Package</a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666;">If you have any questions about your shipment, please reply directly to this email.</p>
  `;

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Your NativeHarvest Order #${order.order_id} Has Been Shipped`,
    html: getBaseEmailTemplate(htmlContent)
  };

  await transporter.sendMail(mailOptions);
}

/* ---------------------------------------------------
   🎉 Delivered Notification + Marketing (UPDATED UI)
--------------------------------------------------- */
async function sendDeliveredNotification(order) {

  const htmlContent = `
    <h2 style="color: #1f2d2a; margin-top: 0;">Order Delivered 🎉</h2>
    <p>Hi ${order.customer_name || 'there'},</p>
    <p>Your NativeHarvest order <strong>#${order.order_id}</strong> has been successfully delivered.</p>
    <p>We hope you love our authentic, farm-made goods. Every purchase you make directly supports rural farming communities in Bundelkhand.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://nativeharvest.store" class="button">Shop Again</a>
    </div>
  `;

  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Delivered - #${order.order_id} 🎉`,
    html: getBaseEmailTemplate(htmlContent)
  };

  await transporter.sendMail(mailOptions);
}

/* ---------------------------------------------------
   📢 Send Promotional Email Blast (UNCHANGED)
--------------------------------------------------- */
async function sendPromotionalBlast(emails, subject, htmlContent) {
  const mailOptions = {
    from: `"NativeHarvest" <${process.env.EMAIL_USER}>`,
    bcc: emails, 
    subject: subject,
    html: htmlContent
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOrderConfirmation,
  sendAdminNotification,
  sendShipmentNotification,
  sendDeliveredNotification,
  sendPromotionalBlast
};