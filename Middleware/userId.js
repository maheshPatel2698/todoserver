const jwt = require('jsonwebtoken')
const User = require('../Models/User')


const userId = async (req, res, next) => {
    try {
        const token = req.header('Authorization') || req.cookies.token
        if (token === null) {
            return res.status(404).json({
                success: false,
                message: "No Token found Please login to get token"
            })
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user Found !"
            })
        }
        req.id = decoded.id

        return next()

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }

}



module.exports = userId