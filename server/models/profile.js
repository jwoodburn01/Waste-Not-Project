const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

// this model is for the profile
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
    timestamps: true, // has a time stamp so we can see when the account was created
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
// this will encrypt the password to ensure no one can work out what it is
profileSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// sends to the profiles collection in mongo
const profileModel = mongoose.model("profile", profileSchema, "profiles")
module.exports = profileModel