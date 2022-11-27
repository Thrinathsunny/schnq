const express=require("express");
const app=express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

dotenv.config()
const mongoose=require("mongoose");
const signupModal=require("./modal/signup-modal");
const signuprouter = require("./routes/signup")
mongoose.connect(process.env.MONGO_URL,(err)=>{
if(!err){
    console.log("connetced to db")
}else{
    console.log(err)
}
}

)
app.use(express.json())
app.listen(3001,(err)=>{
  if(!err){
    console.log("server started sucessfully");
  }else{
    console.log(err)

  }
})
app.get("/",(req,res)=>{
    res.status(200).send("server started succesfully")
})
app.use("/",signuprouter)

