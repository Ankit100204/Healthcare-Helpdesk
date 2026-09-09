const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {

    NODE_ENV: str({
        default: "development"
    }),

    PORT: port({
        default: 5000
    }),

    MONGO_URI: str(),

    JWT_SECRET: str(),

    JWT_EXPIRES_IN: str(),

    JWT_REFRESH_SECRET: str(),

    JWT_REFRESH_EXPIRES_IN: str(),

    CLIENT_URL: str(),

    LOG_LEVEL: str({
        default: "info"
    }),
    REDIS_URL: str()

});

module.exports = env;