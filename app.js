//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

// Level 2 mongoose encryption
// const encrypt = require('mongoose-encryption')

// Level 3 Encryption(Hash)
// const md5 = require('md5');

// Level 4 bcrypt Salting hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// MOngoose step -1 (MongoDB connection) 
mongoURI =  "mongodb://localhost:27017/userDB" 
mongoose.connect(mongoURI, { useNewUrlParser: true }) 
.then(() => console.log("MongoDB connected")) 
.catch((err) => console.log(err)); 

//  MOngoose step -2 (Create schema)
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

// Level-2 (encryption)
// const secret = process.env.SECRET
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });


//  Mongoose step -3 (Create Model)
const User = new mongoose.model("User",userSchema);

app.get('/',(req,res) => {
    res.render ('home')});

app.get ('/login',(req,res) => {
    res.render('login')
})

app.get('/register',(req,res) => {
    res.render('register')
})

// User register
app.post('/register',(req,res) => {

    // Level 4 bcrypt Salting hashing
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email:req.body.username,
            // level 3 md5 hashing
            // password:req.body.password
            password: hash
        })
        // Check and render secrets
        newUser.save(err => {
            if(err){res.send(e)}
        else{res.render('secrets')}  
    })  
    });
});

//User login
app.post('/login',(req,res) => {
    const username = req.body.username;
    const password = req.body.password
    // level 3 MD5 Hashing
    // const password = md5(req.body.password);
    
    User.findOne({email:username},
        (err,foundUser) => {
            if(err){
                console.log(err)
                res.send(err)
            }
            else{
                if(foundUser)
              // Level 4 bcrypt Salting hashing
                bcrypt.compare(password, foundUser.password, function(err, result) {
                  if(result === true){
                    res.render('secrets')
                  }
                });

                // Level 1  password comparision method
                // { if(foundUser.password === password){
                //     res.render('secrets')
                // }}
            }
        })
}) 



app.listen(3000,()=> {
    console.log('Server started successfully')
})