const express = require('express')
const todoRouter = express.Router()
const userId = require('../Middleware/userId')
const Todo = require('../Models/Todo')


todoRouter.get('/', (req, res) => {
    res.send('Hello from todo router')
})

// add todo route
todoRouter.post('/addtodo', userId, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        if (!(title && description && tag)) {
            return res.status(404).json({
                success: false,
                message: "All fields required"
            })
        }
        const todo = await Todo.create({
            user: req.id,
            title,
            description,
            tag
        })
        res.status(200).json({
            success: true,
            todo
        })

    } catch (error) {
        res.status(500).josn({
            success: false,
            message: "Internal Server Error"
        })
    }

})

// delete todo route
todoRouter.delete('/deletetodo/:todoid', userId, async (req, res) => {
    try {
        const todoid = req.params.todoid
        const todo = await Todo.findOne({ _id: todoid })
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "No Todo Found !"
            })
        }
        await Todo.findByIdAndDelete(todoid)
        res.status(200).json({
            success: true,
            message: 'Todo Deleted'
        })
    } catch (error) {
        res.status(500).josn({
            success: false,
            message: "Internal Server Error"
        })
    }


})

// update todo route
todoRouter.put('/updatetodo/:id', userId, async (req, res) => {
    try {
        const { title, description, tag } = req.body

        if (!(title && description && tag)) {
            return res.status(404).json({
                success: false,
                message: "All fields required"
            })
        }
        const id = req.params.id

        const todo = await Todo.findOne({
            _id: id
        })
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "No Todo Found!"
            })
        }
        let newTodo = {
            title,
            description,
            tag
        }
        const updatedTodo = await Todo.findByIdAndUpdate(id, { $set: newTodo }, { new: true })
        res.status(200).json({
            message: "Todo Updated",
            success: true,
            updatedTodo
        })
    } catch (error) {
        res.status(500).josn({
            success: false,
            message: "Internal Server Error"
        })
    }



})

// get all user todo
todoRouter.get('/usertodo', userId, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.id })
        if (!todos) {
            return res.status(404).json({
                success: false,
                message: 'No Todos found'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                todos
            })
        }
    } catch (error) {
        console.log(error)
    }

})



module.exports = todoRouter