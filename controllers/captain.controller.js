const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.service')
const { validationResult } = require('express-validator')
const blackListModel = require("../models/blacklistToken.model")

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { fullName, email, password, vehicle } = req.body

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) return res.status(400).json({ status: "failed", message: "Captain already exist with this email please try diffrent one" })
    const hashedPassword = await captainModel.hashPassword(password)

    const captain = await captainService.createCaptain({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

    const token = captain.generateAuthToken()

    return res.status(201).json({ token, captain })
}

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const captain = await captainModel.findOne({ email }).select('+password')
    if (!captain) return res.status(400).json({ status: "failed", message: "Invalid eemail and password" })

    const isPasswordMatch = await captain.comparePassword(password);

    if (!isPasswordMatch) return res.status(400).json({ status: "failed", message: "Invalid eemail and password" })

    const token = captain.generateAuthToken()

    return res.status(200).json({ token })
}

module.exports.captainProfile = async (req, res) => {
    return res.status(200).json({ status: "success", data: req.user })
}

module.exports.logoutCaptain = async (req, res) => {
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    await blackListModel.create({ token })

    res.status(200).json({ type: "success", message: "Logout successful" })
}