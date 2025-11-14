const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const pool = require("../utils/db");
const result = require("../utils/result");
const  config  = require("../utils/config");

const router = express.Router();

router.post('/register', async(req, res) =>{
    const {first_name, last_name, email, password, mobile, birth} = req.body;
    const sql = `INSERT INTO users(first_name, last_name, email, password, mobile, birth) VALUES(?,?,?,?,?,?)`
    try{
        const hashpassword = await bcrypt.hash(password, config.saltRounds);
        pool.query(sql, [first_name, last_name, email, hashpassword, mobile, birth], (error, data) => {
            res.send(result.createResult(error, data))
        })
    }catch(error){
        res.send(result.createResult(error));

    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT * FROM users WHERE email = ?`
    pool.query(sql, [email], async (error, data) => {
        if (data != '') {
            const dbUser = data[0]
            console.log(dbUser.password);
            const userValid = await bcrypt.compare(password, dbUser.password);
            console.log(userValid);
            console.log(password);
            console.log("DB Hash Length:", dbUser.password.length);
            console.log("Input Password Length:", password.length);

            if (userValid) {
                // body part inside the jwt that needs to be encrypted
                const payload = {
                    id: dbUser.id
                }
                // create the jwt token
                const token = jwt.sign(payload, config.secret)
                const user = {
                    token: token,
                    name: dbUser.first_name,
                    email: dbUser.email
                }
                res.send(result.createResult(error, user))
            }
            else
                res.send(result.createResult('Invalid Password'))
        }
        else
            res.send(result.createResult('Invalid Email'))
    })
})

router.put('/editProfile', (req, res)=>{
    const {id,first_name, last_name, email, password, mobile, birth} = req.body;
    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? , mobile = ? , birth = ? where id= ?`;
    pool.query(sql, [first_name, last_name, email, password, mobile, birth, id], (error, data)=>{
        res.send(result.createResult(error, data));
    } )
})




/*router.post('/login', (req, res) => {
    const { email, password } = req.body
    const sql = `SELECT * FROM users WHERE email = ?`
    
    pool.query(sql, [email], async (error, data) => {
        // Handle critical database errors immediately
        if (error) {
            return res.send(result.createResult(error));
        }

        if (data.length > 0) {
            const dbUser = data[0];
            
            try {
                const userValid = await bcrypt.compare(password, dbUser.password);

                if (userValid) {
                    // body part inside the jwt that needs to be encrypted
                    const payload = {
                        // Use the correct 'id' column name assuming 'uid' was a typo
                        id: dbUser.id 
                    };
                    
                    // create the jwt token
                    const token = jwt.sign(payload, config.secret);
                    
                    const user = {
                        token: token,
                        // Assuming your database has a 'name' column, 
                        // or perhaps you mean first_name + last_name
                        name: dbUser.first_name + ' ' + dbUser.last_name, 
                        email: dbUser.email
                    };
                    
                    res.send(result.createResult(null, user)); // Success result
                } else {
                    res.send(result.createResult('Invalid Password')); // Error result
                }
            } catch (compareError) {
                // Handle bcrypt errors
                res.send(result.createResult(compareError));
            }
        } else {
            res.send(result.createResult('Invalid Email')); // Error result
        }
    });
});*/



module.exports = router ;