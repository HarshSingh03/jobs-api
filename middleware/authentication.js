const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {UnauthenticatedError}= require('../errors');

const auth = async (req,res,next)=>{
  //check header
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError('Authentication Invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //atttach the uset to the job routes
    const user = await User.findById(payload.userId).select('-password');
    req.user={
      userId: user._id,
      email:user.email
    }
    

    
    // req.user = {userId:payload.userId, name:payload.name};
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = auth;