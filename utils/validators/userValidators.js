const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User =require('../../model/userModel')
const bcrypt=require('bcryptjs')

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User required')
        .isLength({ min: 3 })
        .withMessage('Too short User name')
        .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
        .notEmpty()
        .withMessage('email  required')
        .isEmail()
        .withMessage('invalid email')
        .custom((val)=> User.findOne({email :val}).then((user) =>{
            if(user){
                return Promise.reject(new Error('email already exist'))
            }
     })
    ),
   check('password')
        .notEmpty()
        .withMessage('password required')
        .isLength({min : 6})
        .withMessage('at least 6 characters')
        .custom((password, { req }) => {
            if(password !== req.body.passwordConfirm) {
              throw new Error('Password missmatch')
            }
            return true
        }),
    
    check('passwordConfirm').notEmpty().withMessage('Password confirm is required'),

    check('phone').isMobilePhone('ar-DZ'),
    check('role').optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('email')
    .notEmpty()
    .withMessage('email  required')
    .isEmail()
    .withMessage('invalid email')
    .custom((val)=> User.findOne({email :val}).then((user) =>{
        if(user){
            return Promise.reject(new Error('email already exist'))
        }
 })
),
  check('phone').isMobilePhone('ar-DZ'),
  check('role').optional(),
  validatorMiddleware,
];


exports.changePasswordValidator=[
  check('id').isMongoId().withMessage('Invalid User id format'),
  check('currentPassword')
    .notEmpty()
    .withMessage('current Password is required'),
  check('confirmPassword')
    .notEmpty()
    .withMessage(' Password confirm is required'),
  check('password')
    .notEmpty()
    .withMessage(' Password  is required')
    .custom(async (val,{req}) => {
      //verify current password
      const user = await User.findById(req.params.id)
      if(!user) {
        throw new Error('there is no user for this id')
      }
     const isCorrectPassword= await bcrypt.compare(
      req.body.currentPassword,
      user.password
    )
    if(!isCorrectPassword){
      throw new Error('incorrect current Password')
    }

    //verify confirm password 
    if(val !== req.body.confirmPassword) {
      throw new Error('Password missmatch')
    }
    return true

  }),
  validatorMiddleware
]

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];