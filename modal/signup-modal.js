const mongoose=require("mongoose")

const signupschema=new mongoose.Schema ({
    name :{
type:String,
required:true
    },
      email:{
        type:String,
          unique:true,
         required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"Employee"
    }
})

const signupModal=mongoose.model("Schnqsignup",signupschema);

module.exports=signupModal