const jwt = require("jsonwebtoken");

const User = require("../models/User");

const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
    console.log("Inside protect middleware");
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Not Authorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "User not found");
    }
   // console.log(req.user);
    req.user = user;

    next();

});

module.exports = protect;