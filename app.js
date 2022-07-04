require('dotenv').config()
const express =require('express');
const bodyParser =require('body-parser');
const ejs = require('ejs');
const mongoose =require('mongoose');
const encrypt = require('mongoose-encryption');


const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});


const User = mongoose.model("User",userSchema);


app.get('/', function (req, res)
{
  res.render("home.ejs");
});
app.get("/login",function(req, res){
  res.render("login.ejs");
});
app.get("/register", function(req, res){
  res.render("register.ejs");
});
app.post("/register",function(req,res){
  const newUser = new User({
    email : req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets.ejs");
    }
  });
});


app.post("/login",function(req,res){
    const username =  req.body.username;
    const password =  req.body.password;

    User.findOne({email:username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets.ejs");
          }else{
            res.render('loginError.ejs');
          }
        }
      }
    })

});

app.listen(3000, function (req,res){
  console.log("Port Successfully Started")
});
