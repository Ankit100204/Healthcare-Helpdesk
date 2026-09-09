const mongoose = require("mongoose");
const logger = require("../config/logger");
const env =require("../config/env");
const connectDB = async () => {

    try {

        const conn = await mongoose.connect(env.MONGO_URI);

        logger.info(
            `MongoDB Connected: ${conn.connection.host}`
        );

    } catch (error) {

        logger.error("Database Connection Failed");

        logger.error(error);

        process.exit(1);

    }

};

module.exports = connectDB;