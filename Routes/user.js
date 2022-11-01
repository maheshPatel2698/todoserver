const express = require('express')
const userRouter = express.Router()
const User = require('../Models/User')
const encpassword = require('../Utils/encpassword')
const validatePassword = require('../Utils/validatePassword')
const cookietoken = require('../Utils/cookietoken')
const userId = require('../Middleware/userId')


userRouter.get('/', (req, res) => {
    res.send('Hello from user router')
})

// signup route
userRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!(name && email && password)) {
            return res.status(404).json({
                success: false,
                message: "All fields required"
            })
        }
        const encPass = await encpassword(password)
        const user = await User.create({
            name,
            email,
            password: encPass,


        })
        user.password = undefined
        res.status(200).json({
            success: true,
            user
        })




    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error
        })
    }

})

// login route
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!(email && password)) {
            return res.status(404).json({
                success: false,
                message: "All fields required"
            })
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user Found'
            })
        }
        const isvalidated = await validatePassword(password, user?.password)
        if (!isvalidated) {
            return res.status(400).json({
                success: false,
                message: "Invalid creds"
            })
        }
        cookietoken(user, res)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error
        })
    }


})

// logour route
userRouter.get('/logout', (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true }).json({
        success: true,
        message: "Login Succcess"
    })
})

// edit route
userRouter.put('/edituser', userId, async (req, res) => {

    const user = await User.findOne({ _id: req.id })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "No user found please signup"
        })
    }
    const { name, email } = req.body

    if (!(name && email)) {
        return res.status(404).json({
            success: false,
            message: "All fields required"
        })
    }

    const newUser = {
        name,
        email,
    }
    user.password = undefined

    const updatedUser = await User.findByIdAndUpdate(req.id, { $set: newUser }, { new: true })
    res.status(200).json({
        updatedUser
    })



})

// delete route
userRouter.delete('/deleteuser', userId, async (req, res) => {
    const user = await User.findOne({ _id: req.id })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No user found'
        })
    }
    await User.findByIdAndDelete(req.id)
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true }).status(200).json({
        success: true,
        message: 'User Deleted'
    })
})



module.exports = userRouter