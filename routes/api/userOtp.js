const express = require('express');
const router = express.Router();
//import UserController from '../../controllers/userController.js';
const UserController = require('../../controllers/userController.js');
const User = require('../../models/User.js');
const TWILIO_ACCOUNT_SID="ACaecee234b9f973724512af4e496ccf9c";
const TWILIO_AUTH_TOKEN="81752e7816af7ae2cb906dae0f596fe7";
const TWILIO_PHONE_NUMBER='+17817546779';

const client = require("twilio")(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);
// @ route          GET api/UserOtp
// @ desc           Test route
// @ access         public


// router.get("/", UserController.index)
// router.post('/login', UserController.userLogin)
// router.post('/verify', UserController.verifyOTP)

router.get('/',async(req,res)=>{
try{
const {phoneNumber} = req.body;

const existingUser = await User.findOne({phoneNumber});
if(existingUser){

let digits  = "0123456789";
OTP = "";
for( let i=0;i<4;i++){
    OTP += digits[Math.floor(Math.random()*10)];
}

console.log(existingUser?.phoneNumber);
await client.messages.create({
    body: `Your OTP Verification for use ${existingUser?.name} is ${OTP}`,
    //messagingServiceSid:``,
    from:TWILIO_PHONE_NUMBER,
    to:"+61480413615"
})
.then(()=>
    res.status(200).json({msg: "Message Sent"})
)

}
else{
    return res
    .status(400).json({msg:"User not registered"});
}
}catch(e){

    res.status(500).json({msg:"Msg not sent"})
}

} )


router.get('/verify',async(req,res)=>{
try{
const body = req.body;
console.log(body);
// console.log(OTP)
if(body?.otp != OTP){
    console.log("Invalid OTP")
    return res.status(400).json({msg:"Incorrect Otp"});
}
const phoneNumber = req.body.phoneNumber;
let user1 = await User.findOne({phoneNumber });

console.log(user1.phone)
console.log("OTP is correct")
const updatedUser = await User.findByIdAndUpdate(user1?._id, {verify:true}, {new:true});
return res.status(200).json({msg:"OTP is verified",updatedUser:updatedUser});


}catch(e){
    res.status(500).json({error:e.message})
}

})

module.exports = router;
