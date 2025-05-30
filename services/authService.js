const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const User= require('../model/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')



const creatToken = (payload) =>
    jwt.sign({userId:payload}, 'the-secret-key-jwt-in-hala-madrid' ,{ //dirha fel env men ba3d
    expiresIn:"90d"
})

//Sign up
//get api/v1/auth/signup
//public
exports.signUp=asyncHandler(async(req,res,next)=>{
    //creat user
    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    })
    
    //generate token

    const token = creatToken(user._id)

    res.status(201).json({ data: user, token });

});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1) check if password and email in the body (validation)
    // 2) check if user exist & check if password is correct
    const user = await User.findOne({ email: req.body.email });
  
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError('Incorrect email or password', 401));
    }
    // 3) generate token
    const token = creatToken(user._id);
  
    // Delete password from response
    delete user._doc.password;
    // 4) send response to client side
    res.status(200).json({ data: user, token });
  });

  // @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          'You are not login, Please login to get access this route',
          401
        )
      );
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, 'the-secret-key-jwt-in-hala-madrid');
   
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belong to this token does no longer exist',
          401
        )
      );
    }
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      // Password changed after token created (Error)
      if (passChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'User recently changed his password. please login again..',
            401
          )
        );
      }
    }
  
    req.user = currentUser;
    next();
  });

  
exports.allowedTo =(...roles) =>
  asyncHandler (async (req,res,next)=> {
    if(!roles.includes(req.user.role)){
      return next(
        new ApiError('You are not allowed to acces this route',403)
      )
    }
    next()
});
