

const {Router}=require("express")
const weatherRouter=Router()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'd1c8f36415msh2e7a1b6caefa3ddp167082jsn33c71d3d8bd8',
    'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
  }
};

const {authenticator}=require("../middlewares/authenticator.middleware")
const {searchmodel}=require("../models/searches.model")
// const {Usermodel}=require("../models/user.model")
// const bcrypt=require("bcrypt")
// const jwt=require("jsonwebtoken")
const Redis = require("ioredis")
const redis=new Redis()
weatherRouter.get("/",(req,res)=>{
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
    const url = `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${prefferedcity}&contentType=json&unitGroup=us&shortColumnNames=0`;

   let value=  await fetch(url, options)
   let data=await value.json()
//    let data1=await data.json()
// console.log(value)

        await redis.set(prefferedcity, JSON.stringify(data));

    console.log(data)
    
    return res.json({message:"request successfull",weather:data})
}
else{
    const all = await redis.get(prefferedcity)
console.log("redis work in this case")
    return res.json({message:"request successfull",weather:JSON.parse(all)})

}



// so here i am going to save the weather data to redis


} catch (error) {
    console.log(error)
    res.json({message:"error",error:error.message})
}
})





module.exports={weatherRouter}
