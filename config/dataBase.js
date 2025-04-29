const mongoose = require('mongoose')

const dbConnection = () => {
    //connect to db
    mongoose.connect(process.env.DB_URI).then((conn) => {
        console.log(`Data Base Connected : ${conn.connection.host}`);
    })
    .catch((err) => {
        console.error(`error DataBase : ${err}`)
        process.exit(1)
    })
    
}
module.exports = dbConnection