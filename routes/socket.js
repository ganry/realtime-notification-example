/*
 * Serve content over a socket
 */

module.exports = function (io) {


    io.sockets.on('connection', function (socket) {

        console.log('user connected');

        socket.on('errorMessage', function (value) {

            console.log('Got error: ', value);

            //send test to everyone except sender
            io.sockets.emit('errorMessage', value);
        });
    });
};