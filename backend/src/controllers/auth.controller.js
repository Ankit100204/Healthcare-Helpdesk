const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {

    const user = await authService.registerUser(req.body);

    return res.status(201).json(

        new ApiResponse(

            201,

            "User Registered Successfully",

            user

        )

    );

});

const login = asyncHandler(async (req, res) => {

    const data = await authService.loginUser(req.body);

    res.cookie("token", data.token, {
        httpOnly: true,
        secure: false,          // true after deployment with HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login Successful",
            {
                user: data.user
            }
        )
    );

});

const getProfile = asyncHandler(async (req, res) => {

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile fetched",

            req.user

        )

    );

});

const logout = asyncHandler(async (req, res) => {

    res.clearCookie("token");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Logout Successful"

        )

    );

});

const changePassword = asyncHandler(async (req, res) => {
    await authService.changePassword(req.user._id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Password changed successfully")
    );
});
module.exports = {

    register,
    login,
    getProfile,
    logout,
    changePassword

};
