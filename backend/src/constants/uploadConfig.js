const UPLOAD_CONFIG = {

    PROFILE: {

        destination: "profiles",

        allowedMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp"
        ],

        maxSize: 5 * 1024 * 1024
    },

    REPORT: {

        destination: "reports",

        allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ],

        maxSize: 20 * 1024 * 1024
    },

    PRESCRIPTION: {

        destination: "prescriptions",

        allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ],

        maxSize: 10 * 1024 * 1024
    }

};

module.exports = {
    UPLOAD_CONFIG
};