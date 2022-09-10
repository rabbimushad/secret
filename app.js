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
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// Level 5 passport.js
const session = require('express-session');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Level 5 passport.js --- start
app.use(session({
    secret: 'this is my first projects',
    resave: false,
    saveUninitialized: false,
  }))
app.use(passport.initialize());
app.use(passport.session());
// Level 5 passport.js ---- end

// Mongoose step -1 (MongoDB connection) 
mongoURI =  "mongodb://localhost:27017/userDB" 
mongoose.connect(mongoURI, { useNewUrlParser: true }) 
.then(() => console.log("MongoDB connected")) 
.catch((err) => console.log(err)); 

//  MOngoose step -2 (Create schema)
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

// Level 5 passport.js 
userSchema.plugin(passportLocalMongoose);

// Level-2 (encryption)
// const secret = process.env.SECRET
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });


//  Mongoose step -3 (Create Model)
const User = new mongoose.model("User",userSchema);

// Level 5 passport.js - start
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Level 5 passport.js - end


app.get('/',(req,res) => {
    res.render ('home')});

app.get ('/login',(req,res) => {
    res.render('login')
})

app.get('/register',(req,res) => {
    res.render('register')
})

app.get('/secrets',(req,res) => {
    // Websecurity method to check authenticity.
    if(req.isAuthenticated()){
        res.render('secrets');
    }else {
        res.redirect('/login');
    }
})

app.get('/logout',(req,res)=> {
    // Passport Method
    req.logout(err => {
        console.log(err)
    });
    res.redirect('/');
})

// // User register
// app.post('/register',(req,res) => {

//     // Level 4 bcrypt Salting hashing
//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//         const newUser = new User({
//             email:req.body.username,
//             // level 3 md5 hashing
//             // password:req.body.password
//             password: hash
//         })
//         // Check and render secrets
//         newUser.save(err => {
//             if(err){res.send(e)}
//         else{res.render('secrets')}  
//     })  
//     });
// });

// Level-5 passportjs - User register - start
app.post('/register',(req,res) => {
User.register({username:req.body.username}, req.body.password,(err,user) => {
    if(err){
        console.log(err);
        res.redirect('/register')
    }else{
        passport.authenticate('local')(req,res,()=> {
            res.redirect('/secrets');
        })
    }
})
})
// Level-5 passportjs - User register - end

// //User login
// app.post('/login',(req,res) => {
//     const username = req.body.username;
//     const password = req.body.password
//     // level 3 MD5 Hashing
//     // const password = md5(req.body.password);
    
//     User.findOne({email:username},
//         (err,foundUser) => {
//             if(err){
//                 console.log(err)
//                 res.send(err)
//             }
//             else{
//                 if(foundUser)
//               // Level 4 bcrypt Salting hashing
//                 bcrypt.compare(password, foundUser.password, function(err, result) {
//                   if(result === true){
//                     res.render('secrets')
//                   }
//                 });

//                 // Level 1  password comparision method
//                 // { if(foundUser.password === password){
//                 //     res.render('secrets')
//                 // }}
//             }
//         })
// }) 

// Level-5 passportjs - User login - start
app.post('/login',(req,res) => {
    const user = new User ({
        username:req.body.username,
        passsword:req.body.password
    });
    // Passport method
    req.login(user,(err)=> {
        if(err){
            console.log(err)
        }else{
            passport.authenticate('local')(req,res,()=> {
                res.redirect('/secrets');
            })
        }
    })
})
// Level-5 passportjs - User login - End


app.listen(3000,()=> {
    console.log('Server started successfully')
})