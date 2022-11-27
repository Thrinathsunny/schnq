const express=require("express");
const signupModal = require("../modal/signup-modal");
const {checkExistinguser,generatePasswordHash,toSorting}=require("../utility")
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  courseModal=require("../modal/course-modal");

router.post("/signup",async(req,res)=>{
    if (await checkExistinguser(req.body.email)) {
        res.status(200).send("email already exist")
    } else {
        generatePasswordHash(req.body.password).then((passwordHash) => {
            signupModal.create({ name:req.body.name,email: req.body.email, password: passwordHash,role:req.body.role }).then((data) => {
                res.status(200).send("user signedup sucessfully")
            }).catch((err) => {
                res.status(400).send(err.message)
            })

        })

    }
    
})

router.post("/signin", (req, res) => {

    signupModal.find({ email: req.body.email }).then((userData) => {

        if (userData.length) {
            bcrypt.compare(req.body.password, userData[0].password).then((val) => {
                if (val) {
                    const authToken = jwt.sign(userData[0].email, process.env.SECRET_KEY);
                    console.log(1)
                    res.status(200).send({ authToken });
                } else {
                    res.status(400).send("invalid password please enter correct password")
                }
            })
        } else  {
            res.status(400).send("email not exist please signup")
        }
    })
})

router.post("/coursepost", async (req,res)=>{
    console.log(1)
    if(req.headers.authorization) {
        console.log(2)
        try {
            const email = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
            console.log(email)
                signupModal.find({email:email}).then((data)=>{
                    console.log(data)
                    if(data[0].role=='admin'){
                        courseModal.create({title:req.body.title,description:req.body.description,video_Url:req.body.video_Url,topics:req.body.topics,duration:req.body.duration,category:req.body.category}).then((data)=>{
                            courseModal.find().then((data)=>{
                                let array=data[0].topics;
                                console.log(array)
                            })
                            res.status(200).send("course added succesfully")
                        })
                    }else{
                        res.send('You cannot post the course')
                    }
                })
        }catch(err){
            res.status(403).send("User Not Authorized")
        }
   }else{
    res.status(400).send("Missing Authorization token")
   }
});

router.put("/update", (req,res)=> {
    console.log(1)
    if(req.headers.authorization) {
            try {
                const email = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
                signupModal.find({email:email}).then((data)=>{
                    if(data[0].role=='admin'){
                        courseModal.find({_id: req.headers.courseid}).then((data)=>{
                            courseModal.updateOne({_id: req.headers.courseid},{$set:{title:req.body.title,description:req.body.description,video_Url:req.body.video_Url,topics:req.body.topics,duration:req.body.duration,category:req.body.category,approved:false}}).then((data)=>{
                                res.status(200).send("updated sucessfully")
                            })
                        })
                    }else if(data[0].role=='super_admin'){
                        // courseModal.updateOne({_id: req.headers.courseid},{$set: {approved:true}})
                        courseModal.find({_id: req.headers.courseid}).then((data)=>{
                            courseModal.updateOne({_id: req.headers.courseid},{$set: {approved:true}}).then((data)=>{
                                res.status(200).send("approved by superadmin sucessfully")
                            })
                        })
                    } else {
                        res.status(403).send("UnAuthorized user cant update the post")
                    }
                })
              } catch(err) {
                res.status(403).send("User Not Authorized")
              }
      } else {
          res.status(400).send("Missing Authorization token")
    }
});
router.delete('/delete', (req,res)=>{
    if(req.headers.authorization) {
        try{
            const email = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
            signupModal.find({email:email}).then((data)=>{
                if(data[0].role=='admin'){
                    courseModal.deleteOne({_id: req.headers.courseid}).then((data)=>{
                        res.send('course deleted successfully ')
                    })
                }else{
                    res.send("You can't delete the course")
                }
            })
} catch{
    res.status(403).send("User Not Authorized")
}
    }else{
        res.status(400).send("Missing Authorization token")
       }
});

router.get("/getallcourses",(req,res)=>{
    

    if(req.headers.authorization){
        try{
            const email = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
            courseModal.find().then((data)=>{
                
       let availablecourses = data.filter((e)=>e.approved==true)
        let hero=availablecourses.sort(toSorting("category"))
        res.status(200).send(hero)
    })
        }
        catch{
            res.status(403).send("User Not Authorized")
        }
    }else{
        res.status(400).send("Missing Authorization token")
       }
})

module.exports=router;