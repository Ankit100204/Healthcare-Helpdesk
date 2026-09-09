require("dotenv").config();
const env = require("./config/env");
const logger = require("./config/logger");
const http = require("http");

const app = require("./app");

const connectDB = require("./config/database");

const { initializeSocket } = require("./config/socket");
const {connectRedis} = require("./config/redis");
const {
    registerSocketEvents
} = require("./socket/socketManager");

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        const server = http.createServer(app);

        initializeSocket(server);

        registerSocketEvents();
        await connectRedis();
        server.listen(PORT, () => {

            logger.info(`Server running on port ${PORT}`);

        });

    } catch (error) {

        logger.error(error);

        process.exit(1);

    }

};

startServer();