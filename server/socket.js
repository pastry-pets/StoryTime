const { Server } = require('socket.io');

// idea for how to pull this out of the index.js file from structure in
// https://socket.io/get-started/basic-crud-application/
function setUpSockets(server) {
  const io = new Server(server); // do I want to try connectionStateRecovery?

  io.on('connect', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  });

}

module.exports = { setUpSockets };