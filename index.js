const express=require("express")
const {connection}=require("./config/db")
const {Usermodel}=require("./models/user.model")
const {userRouter}=require("./Routes/userauth.route")
const {weatherRouter}=require("./Routes/weather.route")
const cookieParser=require("cookie-parser")
const app=express()
const rateLimit = require('express-rate-limit')


const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 15 minutes
	max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const cors=require("cors")
app.use(cors({
    origin:"*"
}))
app.use(cookieParser())

app.use(express.json())
app.use("/userauth",userRouter)
app.use("/weather",weatherRouter,limiter)
app.get("/",(req,res)=>{
    res.json({message:"hello from base url"})
})
// so our server is setup here
app.listen(8000,async()=>{
try {
    await connection
    console.log("connected to db successfully")
    console.log("listening on port 8000")
} catch (error) {
    console.log(error)
}
    
})