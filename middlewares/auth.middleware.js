const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blackListModel = require("../models/blacklistToken.model")

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: "failes", message: "unauthorized user" })
    }

    const isBlackListed = await blackListModel.findOne({ token: token })

    if (isBlackListed) {
        return res.status(401).json({ status: "failed", message: "Unauthorized User" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded?._id
        const user = await userModel.findById(id)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({ status: "failed", message: "Unauthorized User" })
    }
}