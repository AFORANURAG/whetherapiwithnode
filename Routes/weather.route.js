
const {Router}=require("express")
const weatherRouter=Router()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd1c8f36415msh2e7a1b6caefa3ddp167082jsn33c71d3d8bd8',
		'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};
const {authenticator}=require("../middlewares/authenticator.middleware")
const {searchmodel}=require("../models/searches.model")
// const {Usermodel}=require("../models/user.model")
// const bcrypt=require("bcrypt")
// const jwt=require("jsonwebtoken")
const Redis = require("ioredis")
const redis=new Redis()
weatherRouter.get("/",authenticator,(req,res)=>{
   res.send({"message":"hello from wather endpoint"})
})
// so we basically put city in frontend and then it converts city to latitude and logitude 

weatherRouter.post("/city",async (req,res)=>{
let { prefferedcity,lat,lon}=req.body
console.log(lat,lon,prefferedcity)
// console.log(preferredcity)
try {
let query=new searchmodel({prefferedcity:prefferedcity})
await query.save()
// simple key value pair type storage 
 const all = await redis.get(prefferedcity)
console.log(all);
if(!all){
    let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={"36aaac34bd73b6f6dd672d2e660b094c"}`)
    
        
        await redis.set(prefferedcity, JSON.stringify(res));

    console.log(res)
    
    return res.json({message:"request successfull",weather:res})
}
else{
    const all = await redis.get(prefferedcity)
console.log("redis work in this case")
    return res.json({message:"request successfull",weather:all})

}



// so here i am going to save the weather data to redis


} catch (error) {
    console.log(error)
    res.json({message:"error",error:error.message})
}
})





module.exports={weatherRouter}
