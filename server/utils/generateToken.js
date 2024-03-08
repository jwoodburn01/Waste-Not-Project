const jwt = require('jsonwebtoken')
require("dotenv").config();

// this allows the token for the login to be created
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",

    });
};

module.exports = generateToken;