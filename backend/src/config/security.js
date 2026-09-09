const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const env = require("./env");

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:
            "Too many requests. Please try again later."

    }

});

const corsOptions = {

    origin: env.CLIENT_URL,

    credentials: true

};

module.exports = {

    helmet: helmet(),

    cors: cors(corsOptions),

    limiter,

    hpp: hpp(),

    mongoSanitize: mongoSanitize(),

    compression: compression()

};