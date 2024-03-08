const mongoose = require('mongoose')

// this model is for the food
const foodSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    image: String,
    location: String,
    userId: String,
    reserved: Boolean,
    reservedBy: String,
    dairy: Boolean,
    wheat: Boolean,
    nuts: Boolean,
    shellFish: Boolean,
    egg: Boolean
})

// it connects to the food collection inside mongo
const foodModel = mongoose.model("food", foodSchema, "food")
module.exports = foodModel