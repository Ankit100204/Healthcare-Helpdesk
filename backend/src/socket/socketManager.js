const {
    getIO
} = require("../config/socket");

const registerSocketEvents = () => {

    const io = getIO();

    io.on("connection", (socket) => {

        console.log(
            "Client Connected:",
            socket.id
        );
        socket.on("join", (userId) => {

            socket.join(userId);

            console.log(`User ${userId} joined room ${userId}`);

        });
        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Disconnected:",
                    socket.id
                );

            }
        );

    });

};

module.exports = {
    registerSocketEvents
};