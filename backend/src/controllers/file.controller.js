const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const path = require("path");
const User = require("../models/User");

const uploadFile = asyncHandler(async (req, res) => {

    if (!req.file) {

        return res.status(400).json(
            new ApiResponse(
                400,
                "No file uploaded"
            )
        );

    }

    const relativePath = path.relative(
        process.cwd(),
        req.file.path
    );

    return res.status(201).json(

        new ApiResponse(

            201,

            "File uploaded successfully",

            {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                url: "/" + relativePath.replace(/\\/g, "/")
            }

        )

    );

});

const uploadProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, "No image uploaded"));
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: `/uploads/profiles/${req.file.filename}` },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, "Profile image updated", user)
    );
});

module.exports = {
    uploadFile,
    uploadProfileImage
};
