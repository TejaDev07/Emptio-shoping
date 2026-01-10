const nodemailer = require('nodemailer');

// Create nodemailer transporter (fallback)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email using nodemailer
const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Emptio'}" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to Emptio - Your Account is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff3e3e; margin: 0; font-size: 28px;">Welcome to Emptio!</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your account has been created successfully</p>
            </div>

            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <h3 style="color: #2e7d32; margin: 0 0 10px 0;">Hello ${userName}!</h3>
              <p style="margin: 0; color: #2e7d32;">Thank you for joining Emptio. We're excited to have you as part of our community!</p>
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #333; border-bottom: 2px solid #ff3e3e; padding-bottom: 10px;">What you can do now:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>🛍️ Browse our wide selection of products</li>
                <li>❤️ Save your favorite items to your wishlist</li>
                <li>🛒 Add items to cart and checkout securely</li>
                <li>📦 Track your orders in real-time</li>
                <li>📞 Contact our support team anytime</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/login"
                 style="background-color: #ff3e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Start Shopping Now
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
              <h4 style="color: #495057; margin: 0 0 10px 0;">Need Help?</h4>
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                If you have any questions, feel free to contact our support team at
                <a href="mailto:support@emptio.com" style="color: #ff3e3e;">support@emptio.com</a>
              </p>
            </div>

            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              <p>© 2024 Emptio. All rights reserved.</p>
              <p>This email was sent to ${userEmail}. If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (order, userEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Emptio'}" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff3e3e;">Order Confirmed!</h1>
          <p>Thank you for your order. Your order has been placed successfully.</p>

          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3>Items Ordered:</h3>
            <ul style="list-style: none; padding: 0;">
              ${order.items.map(item => `
                <li style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px; border-radius: 3px;">
                  <div>
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>

          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Shipping Address:</strong></p>
            <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.email}</p>
          </div>

          <p>You can track your order status at any time from your account dashboard.</p>

          <p style="color: #666; font-size: 12px;">
            If you have any questions, please contact our customer support.
          </p>
        </div>
      `,
    };

    await sendEmail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send order status update email
const sendOrderStatusUpdate = async (order, userEmail) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      shipped: 'Your order has been shipped and is on its way!',
      out_for_delivery: 'Your order is out for delivery. It will be delivered today.',
      delivered: 'Your order has been successfully delivered. Thank you for shopping with us!',
    };

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Emptio'}" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Update - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff3e3e;">Order Status Update</h1>
          <p>Your order status has been updated.</p>

          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>New Status:</strong> <span style="color: #ff3e3e; font-weight: bold;">${order.status.toUpperCase()}</span></p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
          </div>

          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>${statusMessages[order.status] || 'Your order status has been updated.'}</strong></p>
          </div>

          <p>You can track your order status at any time from your account dashboard.</p>

          <p style="color: #666; font-size: 12px;">
            If you have any questions, please contact our customer support.
          </p>
        </div>
      `,
    };

    await sendEmail(mailOptions);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};