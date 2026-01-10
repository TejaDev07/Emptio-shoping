const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTest() {
  try {
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const to = process.env.TEST_EMAIL_RECIPIENT || process.env.EMAIL_USER || 'no-reply@example.com';

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Emptio'}" <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
      to,
      subject: 'Ethereal test email from Emptio',
      html: `<p>This is a test email sent using Ethereal (dev-only). If you see this, email sending works from the server.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent:', info.messageId);
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('Preview URL:', preview);
    } else {
      console.log('No preview URL available.');
    }
  } catch (err) {
    console.error('Test email failed:', err);
    process.exitCode = 1;
  }
}

sendTest();
