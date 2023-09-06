const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
})

mongoose.connection.on('error', (error) => {
    console.log("Mongoose Error")
    console.log('Error: ', error)
})
mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected!")
})
