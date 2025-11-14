const express = require('express')
const pool = require("../utils/db");
const result = require("../utils/result");
const router = express.Router();




router.post('/addMovie', (req, res) => {

    const { title, release_date } = req.body;
    const sql = `INSERT INTO movies(title, release_date)  VALUES (?, ?)`;
    pool.query(sql, [ title, release_date], (error, data) => {
        res.send(result.createResult(error, data)); 
    });
});

router.get('/displayMovies' ,(req, res) =>{
    //const {title, release_date} = req.body ;
    const sql = `select * from movies `;
    pool.query(sql, (error, data)=>{
        res.send(result.createResult(error, data));
    })


});


module.exports = router