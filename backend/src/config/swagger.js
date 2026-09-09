const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {

    definition: {

        openapi: "3.0.3",

        info: {

            title: "Healthcare Helpdesk API",

            version: "1.0.0",

            description:
                "Healthcare Helpdesk Backend API Documentation"

        },

        servers: [

            {
                url: "http://localhost:5000/api"
            }

        ],
         tags: [

            {

                name: "Authentication",

                description:
                "User Authentication APIs"

            },

            {

                name: "Doctors",

                description:
                "Doctor Management APIs"

            },

            {

                name: "Patients",

                description:
                "Patient Management APIs"

            },

            {

                name: "Slots",

                description:
                "Appointment Slot APIs"

            },

            {

                name: "Appointments",

                description:
                "Appointment APIs"

            },

            {

                name: "Medical Reports",

                description:
                "Medical Report APIs"

            },

            {

                name: "Prescriptions",

                description:
                "Prescription APIs"

            },

            {

                name: "Notifications",

                description:
                "Notification APIs"

            },

            {

                name: "Dashboard",

                description:
                "Dashboard APIs"

            }

        ],


        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        },

            security: [

                {
                    bearerAuth: []
                }

            ]

    },

    apis: [

        "./src/docs/**/*.yaml"

    ]

};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {

    swaggerUi,

    swaggerSpec

};