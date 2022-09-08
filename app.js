//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

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
const secret = process.env.SECRET
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });

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
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
    // Check and render secrets
    newUser.save(err => {
        if(err){res.send(e)}
    else{res.render('secrets')}  
})
});

//User login
app.post('/login',(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},
        (err,foundUser) => {
            if(err){
                console.log(err)
                res.send(err)
            }
            else{
                if(foundUser)
                { if(foundUser.password === password){
                    res.render('secrets')
                }}
            }
        })
}) 



app.listen(3000,()=> {
    console.log('Server started successfully')
})