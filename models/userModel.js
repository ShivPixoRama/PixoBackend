const mongoose = require('mongoose');

// Define Mongoose schema
const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
        otpExpiration: {
        type: Date,
        required: true,
    },
    });
  // Define Mongoose model
    //const UserOtp = mongoose.model('UserOtp', userSchema);

    module.exports = UserOtp = mongoose.model('userOtp', userSchema);
