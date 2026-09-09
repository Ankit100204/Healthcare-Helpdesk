const reportService = require("../services/report.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const uploadMedicalReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.uploadMedicalReport(

            req.user._id,

            req.body,

            req.file

        );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Medical report uploaded successfully",

            report

        )

    );

});
const getMyReports = asyncHandler(async (req, res) => {

    const reports =
        await reportService.getMyReports(

            req.user._id,

            req.query

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Medical reports fetched successfully",

            reports

        )

    );

});
const getDoctorReports = asyncHandler(async (req, res) => {

    const reports =
        await reportService.getDoctorReports(

            req.user._id,

            req.query

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Reports fetched successfully",

            reports

        )

    );

});
const getReportById = asyncHandler(async (req, res) => {

    const report =
        await reportService.getReportById(

            req.user._id,

            req.user.role,

            req.params.id

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Medical report fetched successfully",

            report

        )

    );

});
const deleteReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.deleteReport(

            req.user._id,

            req.user.role,

            req.params.id

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Medical report deleted successfully",

            report

        )

    );

});

const downloadReport = asyncHandler(async (req, res) => {

    const { absolutePath, originalName } =
        await reportService.downloadReport(

            req.user._id,

            req.user.role,

            req.params.id

        );

    return res.download(absolutePath, originalName);

});

module.exports = {

    uploadMedicalReport,

    getMyReports,

    getReportById,

    deleteReport,
    getDoctorReports,

    downloadReport

};
