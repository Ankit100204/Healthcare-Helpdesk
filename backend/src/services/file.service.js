const fs = require("fs");
const path = require("path");

const deleteFile = async (relativePath) => {

    const absolutePath = path.join(
        process.cwd(),
        relativePath
    );

    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }

};

const getPublicUrl = (relativePath) => {

    return relativePath.replace(/\\/g, "/");

};

module.exports = {
    deleteFile,
    getPublicUrl
};