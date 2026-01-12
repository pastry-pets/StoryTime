const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

const io = new Server(server); // do I want to try connectionStateRecovery?

module.exports = { app, server, io };