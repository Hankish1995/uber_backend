const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const userController = require("../controllers/user.controller")
const { authUser } = require("../middlewares/auth.middleware")

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage("First Name must be 3 character long"),
    body('fullName.lastName').isLength({ min: 3 }).withMessage("Last Name must 3 character long"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6 character long"),
],
    userController.registerUser)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 chracter long')
], userController.loginUser)

router.get('/profile', authUser, userController.getUserProfile)
router.get('/logout', authUser, userController.logoutUser)


module.exports = router