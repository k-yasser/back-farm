const factory = require('./handlersFactory');
const user = require('../model/userModel');
const ApiError =require("../utils/apiError")
const asyncHandler = require('express-async-handler')
const User =require('../model/userModel')
const bcrypt =require('bcryptjs')

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = factory.getAll(user);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  private
exports.getUser = factory.getOne(user);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = factory.createOne(user);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser =   asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, 
        {
            name:req.body.name,
            slug:req.body.slug,
            phone:req.body.phone,
            email:req.body.email,
            role:req.body.role
    }, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });


  exports.changeUserPassword=asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, 
        {
            password:await bcrypt.hash(req.body.password,12),
            passwordChangedAt : Date.now()
    }, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(user);



exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  res.status(200).json({ data: user });
});