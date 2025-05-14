const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User =require('../../model/userModel')


exports.signUpValidator = [
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


  validatorMiddleware,
];

exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('email  required')
        .isEmail()
        .withMessage('invalid email'),

   check('password')
        .notEmpty()
        .withMessage('password required')
        .isLength({min : 6})
        .withMessage('at least 6 characters'),

  validatorMiddleware,
];





