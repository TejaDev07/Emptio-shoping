require('dotenv').config();
const nodemailer = require('nodemailer');

async function run() {
  try {
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Verifying SMTP transporter...');
    await transporter.verify();
    console.log('SMTP transporter verified. Sending test email...');

    const to = process.env.TEST_EMAIL_RECIPIENT || process.env.EMAIL_USER;

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Emptio'}" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'SMTP configuration test from Emptio',
      text: 'This is a test email to verify SMTP credentials.',
      html: '<p>This is a test email to verify SMTP credentials.</p>',
    });

    console.log('Test email sent:', info.messageId || info.response);
    if (info.response) console.log('Response:', info.response);
    console.log('Check the recipient inbox and spam folder.');
  } catch (err) {
    console.error('SMTP test failed:', err);
    process.exitCode = 1;
  }
}

run();
