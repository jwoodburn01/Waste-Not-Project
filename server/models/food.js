const mongoose = require('mongoose')

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

const foodModel = mongoose.model("food", foodSchema, "food")
module.exports = foodModel