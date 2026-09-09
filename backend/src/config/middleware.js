const express = require("express");
const loggerMiddleware =require("../middleware/logger.middleware");
const security =require("./security");
const cookieParser = require("cookie-parser");
// const morgan = require("morgan");
module.exports = (app) => {
   app.use(security.helmet);

    app.use(security.cors);

    app.use(security.limiter);

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

    //app.use(security.mongoSanitize);

    app.use(security.hpp);

    app.use(security.compression);

    app.use(loggerMiddleware);

    app.use("/uploads", express.static("uploads"));
};