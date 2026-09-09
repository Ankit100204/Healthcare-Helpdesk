const express = require("express");

const errorHandler = require("./middleware/error.middleware");
const multerErrorHandler = require("./middleware/multerError.middleware");

const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const slotRoutes = require("./routes/slot.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const fileRoutes = require("./routes/file.routes");
const reportRoutes = require("./routes/report.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const app = express();

require("./config/middleware")(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);



app.use(

    "/api-docs",

    swaggerUi.serve,

    swaggerUi.setup(swaggerSpec)

);
// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Healthcare Helpdesk API Running"
    });
});

// Error handlers
app.use(multerErrorHandler);
app.use(errorHandler);

module.exports = app;
