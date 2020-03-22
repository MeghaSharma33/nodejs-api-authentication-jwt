const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import routes
const authRoute = require('./route/auth');

dotenv.config();
//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true },
() => console.log('connected to db')
);

//Midddleware
app.use(express.json());

//Route middleware
app.use('/api/user',authRoute);

app.listen(5000, () => console.log("Up and running"))