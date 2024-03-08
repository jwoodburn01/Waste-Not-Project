const mongoose = require('mongoose')

// this model is for the charities
const charitySchema = new mongoose.Schema({
    id:String,
    name: String,
    description: String,
    link: String,
    location: String
})

// goes to the local charities collection in mongo
const localCharitiesModel = mongoose.model("localCharities", charitySchema, "localCharities")
module.exports = localCharitiesModel