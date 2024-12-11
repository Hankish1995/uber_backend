const express = require('express')
const router = express.Router();
const { body } = require('express-validator')
const captainController = require("../controllers/captain.controller")
const { authCaptain } = require('../middlewares/auth.middleware')

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage("First Name must be 3 character long"),
    body('fullName.lastName').isLength({ min: 3 }).withMessage("Last Name must 3 character long"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6 character long"),
    body('vehicle.color').isLength({ min: 3 }).withMessage('color must be altleast 3 chracter long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('plate must be altleast 3 chracter long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle,vehicle must be car,motocycle or auto')
], captainController.registerCaptain)

router.post('/login', [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 chracter long')
], captainController.loginCaptain)

router.get("/profile", authCaptain, captainController.captainProfile)
router.get('/logout', authCaptain, captainController.logoutCaptain)
module.exports = router