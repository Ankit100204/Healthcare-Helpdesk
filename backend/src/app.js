const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const slotRoutes = require("./routes/slot.routes");
const appointmentRoutes = require("./routes/appointment.routes");





const app = express();
app.use((req, res, next) => {
    console.log("GLOBAL:", req.method, req.originalUrl);
    next();
});

// Security
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));



//Routes


app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);


// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Helpdesk API Running"
    });
});

app.use(errorHandler);

module.exports = app;