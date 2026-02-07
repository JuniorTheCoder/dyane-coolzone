// File: server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Service request endpoint
app.post('/api/service-request', (req, res) => {
  const { name, phone, email, service, message } = req.body;
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'dyanecoolzone0@gmail.com',
    subject: `New Service Request: ${service}`,
    text: `
      Service Request Details:
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Service: ${service}
      Message: ${message}
      
      Please contact the customer as soon as possible.
    `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending service request:', error);
      return res.status(500).json({ message: 'Error sending request' });
    }
    res.json({ message: 'Service request submitted successfully!' });
  });
});

// Quote request endpoint
app.post('/api/request-quote', (req, res) => {
  const { name, phone, email, appliance, issue } = req.body;
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'dyanecoolzone0@gmail.com',
    subject: `Quote Request: ${appliance}`,
    text: `
      Quote Request Details:
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Appliance: ${appliance}
      Issue: ${issue}
      
      Please provide a quote to the customer.
    `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending quote request:', error);
      return res.status(500).json({ message: 'Error requesting quote' });
    }
    res.json({ message: 'Quote request submitted successfully!' });
  });
});

// Newsletter signup endpoint
app.post('/api/newsletter-signup', (req, res) => {
  const { email } = req.body;
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to Dyane CoolZone Specials!`,
    text: `Thank you for subscribing to our newsletter! You'll receive exclusive offers and specials soon.`
  };

  // Also notify the business
  const notificationMail = {
    from: process.env.EMAIL_USER,
    to: 'dyanecoolzone0@gmail.com',
    subject: `New Newsletter Subscriber`,
    text: `New subscriber: ${email}`
  };

  // Send emails
  transporter.sendMail(mailOptions, (error) => {
    if (error) console.error('Error sending welcome email:', error);
  });
  
  transporter.sendMail(notificationMail, (error, info) => {
    if (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ message: 'Error signing up' });
    }
    res.json({ message: 'Thank you for signing up for our specials!' });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});