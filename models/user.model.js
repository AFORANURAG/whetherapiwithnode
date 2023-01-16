const mongoose=require("mongoose")
const Usermodel=mongoose.model("user",new mongoose.Schema({
name:String,
email:String,
password:String
}))

module.exports={Usermodel}