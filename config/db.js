// this is the file for mongo DB connection

const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true, // to remove depricating warning
    });
    console.log('MongoDB connected... ');
  } catch (err) {
    console.error(err.message);
    // exit process with faliure
    process.exit(1);
  }
};

module.exports = connectDB;
