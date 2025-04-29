const express = require('express');
const dotenv =require('dotenv')
const morgan = require ('morgan')
const dbConnection = require('./config/dataBase')
//routes
const typeRoute = require('./Routes/typeRoutes')
const userRoute = require('./Routes/userRoute')
const animalRoute = require('./Routes/animalRoute')



dotenv.config({path : 'config.env'})


//coonect to DB
dbConnection();

//express app
const app=express();


//midlewear
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(process.env.NODE_ENV)
}
 
// mount routes
app.use('/api/v1/types',typeRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/animals',animalRoute)


const PORT = process.env.PORT || 8000;

 app.listen(PORT ,() =>{
    console.log(`app is running on port :${PORT}`);
});