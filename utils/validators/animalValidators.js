const { check } = require('express-validator');
const moment =require('moment')
const  validatorMiddleware =require('../../middlewares/validatorMiddleware')


exports.createAnimalorValidator=[
    check('type')
        .notEmpty()
        .withMessage('Type is required')
        .isMongoId()
        .withMessage('invalide formate Id'),

    check('age')
        .isNumeric()
        .withMessage('Age should be a number')
        .notEmpty()
        .withMessage('Age is required')
        .custom((value, { req }) => {
            const birthDate = moment(req.body.birthDate, 'YYYY-MM-DD', true);
            if (!birthDate.isValid()) {
                throw new Error('Invalid birth date format');
            }
            const calculatedAge = moment().diff(birthDate, 'years');
            if (parseInt(value) !== calculatedAge) {
                throw new Error(`Age does not match the birth date (Expected: ${calculatedAge})`);
            }
            return true;
        }),

    check('birthDate')
        .notEmpty()
        .withMessage('Birth date is required')
        .isISO8601()
        .withMessage('Enter a valid date')
        .custom((value) => {
            const birthDate = moment(value, 'YYYY-MM-DD', true);
            if (!birthDate.isValid()) {
                throw new Error('Invalid date format');
            }
            if (birthDate.isAfter(moment())) {
                throw new Error('Birth date cannot be in the future');
            }
            return true;
        }),
        check('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['male', 'female'])
        .withMessage('Gender must be either "male" or "female"'),

        validatorMiddleware
];


exports.getAnimalValidator=[
    check('id').isMongoId().withMessage('Invalide formate ID'),
    validatorMiddleware
]

exports.updateAnimalValidator=[
    check('id').isMongoId().withMessage('Invalide formate ID'),
    validatorMiddleware
]

exports.deleteAnimaleValidator=[
    check('id').isMongoId().withMessage('Invalide formate ID'),
    validatorMiddleware
]