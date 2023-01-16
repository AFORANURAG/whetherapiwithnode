const jwt=require("jsonwebtoken")
const Redis = require("ioredis")
const redis=new Redis()
async function authenticator(req,res,next){
let accesstoken=req.cookies.accesstoken


let all=await redis.lrange("blacklistedtoken",0,-1)
// console.log(all)
if(!all?.includes(accesstoken)){
// here we will compare the everythingmlike token decodation
const decoded=jwt.verify(accesstoken,process.env.SECRET_KEY)
if(decoded){
    console.log(decoded)
req.body.email=decoded.email
next()
}else{
res.json({message:"not authorize , please login"})
}

}else{
    res.json({message:"you are logged out please login again"})
}





}
module.exports={authenticator}