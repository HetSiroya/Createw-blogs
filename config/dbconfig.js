require('dotenv').config()
const mongoose = require('mongoose')


const connetDB = async () => {
    try {
        await mongoose.connect(process.env.Mongoose_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB Connected...')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }

}

module.exports = connetDB;