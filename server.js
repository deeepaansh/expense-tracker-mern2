require('dotenv').config({ path: './config/config.env' });

const path = require('path');
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db'); // This imports from separate file
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
const transactions = require('./routes/transactions');
app.use('/api/v1/transactions', transactions);

// Security Middlewares (uncomment when needed)
// app.use(helmet());
// app.use(xss());
// app.use(rateLimit({ windowMs: 10*60*1000, max: 100 }));

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => res.sendFile(
    path.resolve(__dirname, 'client', 'build', 'index.html')
  ));
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
