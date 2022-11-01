const express = require('express')
const app = express()
require('dotenv').config()
const cookie = require('cookie-parser')
const { PORT } = process.env
const cors = require('cors')
const connection = require('./Db/connection')
connection()
app.use(cookie())

app.use(cors())
app.use(express.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://merntodo2022.netlify.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// Home Route
app.get('/', (req, res) => {
    res.status(200).send("Hello from home route")
})

// All Routes
app.use('/api/v1/user', require('./Routes/user'))
app.use('/api/v1/todo', require('./Routes/todo'))

app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`)
})