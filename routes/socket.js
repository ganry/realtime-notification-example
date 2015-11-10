/*
 * Serve content over a socket
 */

module.exports = function (io) {


    io.sockets.on('connection', function (socket) {

        console.log('user connected');

        socket.on('noticeMessage', function (value) {

            console.log('Got notice: ', value);

            //send test to everyone except sender
            socket.broadcast.emit('noticeMessage', value);
        });

        socket.on('warningMessage', function (value) {

            console.log('Got warning: ', value);

            //send test to everyone except sender
            socket.broadcast.emit('warningMessage', value);
        });

        socket.on('errorMessage', function (value) {

            console.log('Got error: ', value);

            //send test to everyone except sender
            socket.broadcast.emit('errorMessage', value);
        });

        socket.on('successMessage', function (value) {

            console.log('Got success: ', value);

            //send test to everyone except sender
            socket.broadcast.emit('successMessage', value);
        });
    });
};