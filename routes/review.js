const express = require('express')
const pool = require("../utils/db");
const result = require("../utils/result");
const router = express.Router();


router.post('/addReview', (req, res) => {

    const { movie_id, review, rating, user_id } = req.body;
    const sql = `INSERT INTO reviews(movie_id, review, rating, user_id, modified) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())`;
    pool.query(sql, [movie_id, review, rating, user_id], (error, data) => {
        res.send(result.createResult(error, data)); 
    });
});

router.put('/updateReview', (req, res) =>{
    const {id, review, rating} = req.body;
    const sql = `UPDATE reviews SET review = ?, rating = ? WHERE id = ?`;
    pool.query(sql,[review, rating, id] ,(error, data) =>{
        res.send(result.createResult(error, data))
    })
})

router.delete('/deleteReview', (req, res)=>{
    const {id} = req.body;
    const sql = `DELETE FROM users WHERE id = ?`
    pool.query(sql, [id], (error, data)=>{
        res.send(result.createResult(error, data));
    }) 
});

router.post('/myReview', (req, res) => {
    const { user_id } = req.body; 
    const sql = `SELECT * FROM reviews WHERE user_id = ?`;
    pool.query(sql, [user_id], (error, data) => {
        res.send(result.createResult(error, data));
    });
});

router.post('/allReview', (req, res)=>{
    const sql = `SELECT * FROM reviews`;
    pool.query(sql, (error, data)=>{
        res.send(result.createResult(error, data));
    });
});

module.exports = router;