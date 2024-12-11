const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const { validationResult } = require('express-validator')
const blackListModel = require("../models/blacklistToken.model")

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { fullName, email, password } = req.body;
    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) return res.status(200).json({ status: "failed", message: "User already exist with this email" })

    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword
    })
    const token = user.generateAuthToken()
    req.cookie('token', token)
    res.status(200).json({ token, user })
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) return res.status(401).json({ status: "failed", message: "Invalid email and password" })

    const isMatch = await user.comparePassword(password)

    if (!isMatch) return res.status(401).json({ status: "false", message: "Invalid email or password" })

    const token = user.generateAuthToken();
    req.cookie('token', token)

    res.status(200).json({ status: "success", user, token })
}

module.exports.getUserProfile = async (req, res) => {
    return res.status(200).json({ status: "success", data: req.user })
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    await blackListModel.create({ token })

    res.status(200).json({ type: "success", message: "Logout successful" })
}