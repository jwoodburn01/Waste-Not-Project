const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const profileSchema = new mongoose.Schema({
    id: String,
    fName: String,
    lName: String,
    email: String,
    password: String,
    type: String,
    pic: String,
    createdAt: Date
},
{
    timestamps: true,
}
    
)

// Password enryption using the salt with a value of 10 to hash the password value
profileSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

profileSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const profileModel = mongoose.model("profile", profileSchema, "profiles")
module.exports = profileModel