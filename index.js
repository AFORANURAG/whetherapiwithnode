const express=require("express")
const {connection}=require("./config/db")
const {Usermodel}=require("./models/user.model")
const {userRouter}=require("./Routes/userauth.route")
const {weatherRouter}=require("./Routes/weather.route")
const cookieParser=require("cookie-parser")
const app=express()
const rateLimit = require('express-rate-limit')

const  winston = require('winston'),
    expressWinston = require('express-winston')

    app.use(expressWinston.logger({
        transports: [
          new winston.transports.Console()
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json(),
          winston.format.prettyPrint()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
      }));
  
    


const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 20, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:
		'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const cors=require("cors")
app.use(cors({
    origin:"*"
}))
app.use(cookieParser())

app.use(express.json())
app.use(createAccountLimiter)
app.use("/userauth",userRouter)
app.use("/weather",weatherRouter)
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