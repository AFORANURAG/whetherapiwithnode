const mongoose=require("mongoose")
const searchmodel=mongoose.model("searches",new mongoose.Schema({
preferredcity:String

}))

module.exports={searchmodel}