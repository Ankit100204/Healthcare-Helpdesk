const { param } = require("express-validator");
const { isValidObjectId } = require("../utils/validationHelper");

const notificationIdValidator = [

    param("id")
        .custom((value) => {

            if (!isValidObjectId(value)) {
                throw new Error("Invalid notification id");
            }

            return true;

        })

];

module.exports = {
    notificationIdValidator
};