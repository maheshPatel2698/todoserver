const mongoose = require('mongoose')

const connection = () => {
    mongoose.connect(process.env.MONGO_URI, (req, res) => {
        console.log("Db Connected !")
    })
}


module.exports = connection