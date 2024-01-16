const express = require('express');
const connectDB = require('./config/db');
// import UserController from "./controllers/userController.js";

const app = express();
// Connect Database

connectDB();

//Init Middleware

app.use(express.json({ extended: false })); // earlier there used to be body parser but now we have express for this

app.get('/', (req, res) => res.send('API running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/otp', require('./routes/api/userOtp'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
