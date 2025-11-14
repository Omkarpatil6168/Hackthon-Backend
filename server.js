const express = require('express');
const app = express();
//const mysql= require("mysql2");
const userRouter = require('./routes/user');
const movieRouter = require("./routes/movies");
const reviewRouter = require("./routes/review");
const cors = require("cors");
const myAuth = require('./utils/auth');



// app.get("/", (req, res) => {
//     res.send ("Welcome to home page.")
// });

app.use(cors());
app.use(express.json());
app.use(myAuth);
app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use('/review', reviewRouter);
//app.use('/login', )
app.listen(4000, 'localhost', ()=>{
    console.log("App is running on port 4000")
})