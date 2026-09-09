const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor")
const { ROLES } = require("../constants/roles");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const registerUser = async (userData) => {

    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        role = ROLES.PATIENT
    } = userData;

    // Check existing email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {

        throw new ApiError(
            409,
            "Email already exists"
        );

    }

    // Check existing phone
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
        throw new ApiError(
            409,
            "Phone number already registered");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role
    });
    if (role === ROLES.PATIENT) {

        await Patient.create({

            user: user._id

        });

    } else if (role === ROLES.DOCTOR) {

        await Doctor.create({

            user: user._id

        });

    }

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    };

};

const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id, user.role);

    return {
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select("+password");

    if (!user || !(await user.comparePassword(currentPassword))) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();
};

module.exports = {
    registerUser,
    loginUser,
    changePassword
};
