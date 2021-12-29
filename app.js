//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
mongoose.connect('mongodb://localhost:27017/users');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const schema = mongoose.Schema;

const usersSchema = new schema({username: String, password: String});

usersSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("user", usersSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res)=> res.render("home"));

app.get("/secrets", (req, res)=> res.render("secrets"));

app.get("/logout", (req,res)=> res.render("logout"));






app.route("/register")

.get(function(req, res){res.render("register");})

.post(function(req,res){
    const newUser = new User({username: req.body.username, password: req.body.password});
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else{
            res.render("secrets");
        }
    });
   
});

app.route("/login") 

.get(function(req, res){res.render("login")})

.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
            if(foundUser.password === password){
            res.render("secrets");
            };
        };
        };
    });
});





app.listen(3000, function(req,res){
    console.log("app is listening to port 3000");
});



