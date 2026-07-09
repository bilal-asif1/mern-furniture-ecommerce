import asyncHandler from 'express-async-handler';
import getMailTransport from '../utils/mailer.js';

const CONTACT_RECIPIENT = 'bilalasif921@gmail.com';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sendContactEmail = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required.');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address.');
  }

  const transporter = getMailTransport();
  if (!transporter) {
    res.status(500);
    throw new Error('Email service is not configured yet. Please contact support.');
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `Contact form message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2 style="margin-bottom: 16px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact email failed:', error);
    res.status(500);
    throw new Error('We could not send your message right now. Please try again in a moment.');
  }
});

export { sendContactEmail };
