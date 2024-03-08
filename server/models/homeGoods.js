const mongoose = require('mongoose')

// this model is for the home goods
const homeGoodsSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    image: String,
    location: String,
    userId: String,
    reserved: Boolean,
    reservedBy: String,
    furniture: Boolean,
    kitchen: Boolean,
    lighting: Boolean,
    storage: Boolean,
    decor: Boolean,
    miscellaneous: Boolean
})

// it goes to the home goods model inside mongo
const homeGoodsModel = mongoose.model("homeGoods", homeGoodsSchema, "homeGoods")
module.exports = homeGoodsModel