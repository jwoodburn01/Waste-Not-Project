const mongoose = require('mongoose')

// this model is for my news slideshow
const slideshowSchema = new mongoose.Schema({
    url: String,
    caption: String,
    site: String,
    link: String,
})

const slideshowModel = mongoose.model("slideshow", slideshowSchema, "slideshow")
module.exports = slideshowModel