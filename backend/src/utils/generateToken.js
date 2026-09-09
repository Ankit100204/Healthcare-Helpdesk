const jwt = require("jsonwebtoken");
const env = require("../config/env");
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
        },
        env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

module.exports = generateToken;