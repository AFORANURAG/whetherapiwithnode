
const {Router}=require("express")
const userRouter=Router()
const {Usermodel}=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const Redis = require("ioredis")
const redis=new Redis()
const {authenticator}=require("../middlewares/authenticator.middleware")
// ok so lets setup redis


userRouter.get("/",authenticator,(req,res)=>{
    res.json({message:"welcome tobase route of userauth"})
})

userRouter.post("/signup",async(req,res)=>{
let {email,password,name}=req.body

try {
// hash the password synchronously
const hash=bcrypt.hashSync(password,4)
let query=new Usermodel({email,name,password:hash})    
await query.save()
return res.status(201).json({message:"signup successfully"})
} catch (error) {
    console.log(error)
  res.json({message:"error",error:error.message})  
}
})


userRouter.post("/login",async(req,res)=>{
    let {email,password}=req.body
    const loadingfromdb=await Usermodel.findOne({email})
console.log(loadingfromdb)
const hashfromdb=loadingfromdb?.password
    try {
    // hash the password synchronously

    const compare=bcrypt.compareSync(password,hashfromdb)
    if(compare){
    const  token = jwt.sign({ email:email },process.env.SECRET_KEY ); 
res.cookie("accesstoken",token)
res.json({message:"login successfull"})
    }else{

    }
   
    } catch (error) {
        console.log(error)
      res.json({message:"error",error:error.message})  
    }
    })

userRouter.post("/logout",async (req,res)=>{
// so here i will take the token and i will put it in blacklisted list in redis
let accesstoken=req.cookies.accesstoken
try{
await redis.lpush("blacklistedtoken",accesstoken)
res.json({message:"logout successfull"})

} catch (error) {
    console.log(error)
    res.json({message:"error",error:error.message})
}



})



module.exports={userRouter}

// there is not role base access controls

