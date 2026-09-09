const prescriptionService = require("../services/prescription.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const createPrescription = asyncHandler(async (req, res) => {

    const prescription =
        await prescriptionService.createPrescriptionService(

            req.user._id,

            req.body

        );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Prescription created successfully",

            prescription

        )

    );

});
const getMyPrescriptions = asyncHandler(async (req, res) => {

    const prescriptions =
        await prescriptionService.getMyPrescriptions(

            req.user._id,

            req.query

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescriptions fetched successfully",

            prescriptions

        )

    );

});
const getDoctorPrescriptions = asyncHandler(async (req, res) => {

    const prescriptions =
        await prescriptionService.getDoctorPrescriptions(

            req.user._id,

            req.query

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescriptions fetched successfully",

            prescriptions

        )

    );

});
const getAllPrescriptions = asyncHandler(async (req, res) => {

    const prescriptions =
        await prescriptionService.getAllPrescriptions(

            req.query

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescriptions fetched successfully",

            prescriptions

        )

    );

});
const getPrescriptionById = asyncHandler(async (req, res) => {

    const prescription =
        await prescriptionService.getPrescriptionById(

            req.user._id,

            req.user.role,

            req.params.id

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescription fetched successfully",

            prescription

        )

    );

});
const updatePrescription = asyncHandler(async (req, res) => {

    const prescription =
        await prescriptionService.updatePrescription(

            req.user._id,

            req.user.role,

            req.params.id,

            req.body

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescription updated successfully",

            prescription

        )

    );

});
const deletePrescription = asyncHandler(async (req, res) => {

    const prescription =
        await prescriptionService.deletePrescription(

            req.user._id,

            req.user.role,

            req.params.id

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Prescription deleted successfully",

            prescription

        )

    );

});
module.exports = {

    createPrescription,

    getMyPrescriptions,

    getDoctorPrescriptions,

    getAllPrescriptions,

    getPrescriptionById,

    updatePrescription,

    deletePrescription

};
