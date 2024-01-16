const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

// @ route          GET api/auth
// @ desc           Test route
// @ access         public
router.get('/',auth , async(req, res) => {

    try{
        const user = await User.findById(req.user.id).select('-password'); // to leave password out of data
        res.json(user);
    }catch(err){
console.errror(err.message);
res.status(500).send('Server Error');
    }

});

// @ route          POST api/auth
// @ desc           Authenticate user and get token
// @ access         public
router.post(
    '/',
    [
      
      check('email', 'Please include valid email').isEmail(),
      check('password','Password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, password } = req.body;
  
      try {
        // see if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
      
        const isMatch = await bcrypt.compare(password, user.password); // using compare to check if hashed password and entered pswd is correct
      if(!isMatch){
        return res
        .status(400)
        .json({errors:[{msg:'Invalid Credentials'}]});
      }
  
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
            expiresIn: 360000000,
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
