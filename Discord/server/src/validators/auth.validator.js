import {body} from 'express-validator'

export const registerValidtors = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({min:3,max:20})
    .withMessage("username must be between 3 and 20 charcters"),

    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")    
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("fullname")
        .notEmpty()
        .withMessage("Full name is required"),
]

export const loginValidators = [
    body("email"),
]