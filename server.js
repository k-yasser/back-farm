const express = require('express');
const dotenv =require('dotenv')
const morgan = require ('morgan')
const dbConnection = require('./config/dataBase')
//routes
const typeRoute = require('./Routes/typeRoutes')
const userRoute = require('./Routes/userRoute')
const animalRoute = require('./Routes/animalRoute')
const authRoute = require('./Routes/authRoute')
const cors = require('cors');





dotenv.config({path : 'config.env'})


//coonect to DB
dbConnection();

//express app
const app=express();


app.use(cors({ origin: "*", credentials: true }));


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
app.use('/api/v1/auth',authRoute)



const PORT = process.env.PORT || 8000;

 app.listen(PORT ,() =>{
    console.log(`app is running on port :${PORT}`);
});