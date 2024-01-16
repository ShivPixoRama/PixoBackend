const express = require('express');
const { Result } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const moment = require('moment'); 

const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const { json } = require('express');

// @ route          POST api/users
// @ desc           Register route
// @ access         public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check(
      'password',
      'Please enter a valid password with 6 or more characters '
    ).isLength({
      min: 6,
    }),
    check('dob','Please enter a valid Date of Birth').isISO8601(), // Checks if the date is in a valid ISO 8601 format
    check('phoneNumber')
    .isMobilePhone('en-AU') //  can be replaced with specific locale(s), e.g., 'en-US'
    .withMessage('Invalid phone number')
    // Custom validation to check if age is at least 18
  // check('dateOfBirth').custom((value) => {
  //   const eighteenYearsAgo = moment().subtract(18, 'years');
  //   if (moment(value).isAfter(eighteenYearsAgo)) {
  //     throw new Error('You must be at least 18 years old');
  //   }
  //   return true;
  // })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password,dob,phoneNumber } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({
        $or: [
            { email: email }, 
            { phoneNumber: phoneNumber }
        ]
    });
      if (user) {
        console.log('1');
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // get usrs Gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        // creating a user instance
        name,
        email,
        avatar,
        password, // here password is not encrupted
        dob,
        phoneNumber
        // phoneNumber
      });
      // encrypting the password
      const salt = await bcrypt.genSalt(10); // we ll get a promise and 10 is the rounds which is recommended in docs, more u have more secure

      user.password = await bcrypt.hash(password, salt); // this creates a hash & puts it in user.pswd

      await user.save(); // this saves user to the db

      const payload = {
        // get the payload which has user ID
        user: {
          id: user.id, // in mongoose they use _id but due to abstarction we cna use id
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // if no error then we send the token back to client
        }
      );
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
























































      } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
