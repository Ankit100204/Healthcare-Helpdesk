const path = require("path");

const getRelativePath = (
    absolutePath
) => {

    return path.relative(
        process.cwd(),
        absolutePath
    ).replace(/\\/g,"/");

};

module.exports = {
    getRelativePath
};