const mongoose = require('mongoose')

const charitySchema = new mongoose.Schema({
    id:String,
    name: String,
    description: String,
    link: String,
    location: String
})

const localCharitiesModel = mongoose.model("localCharities", charitySchema, "localCharities")
module.exports = localCharitiesModel