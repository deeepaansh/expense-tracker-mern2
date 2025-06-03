const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`Database Name: ${conn.connection.name}`.blue.bold);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose connection error: ${err.message}`.red);
    });

  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`.red.bold);
    
    // More specific error messages
    if (err.message.includes('bad auth')) {
      console.log('❌ Authentication failed. Please check:'.red);
      console.log('- Your MongoDB username/password'.yellow);
      console.log('- If using special characters in password, try URL encoding them'.yellow);
      console.log('Pro Tip: Reset your password in MongoDB Atlas Dashboard'.blue);
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination'.yellow);
  process.exit(0);
});

module.exports = connectDB;