// server.js
// Simple WebSocket server using Express and Socket.IO for real-time OBS sync

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let latestLinkedPairs = [];

// Serve a status route
app.get('/', (req, res) => {
  res.send('🟢 WebSocket Server is running.');
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('🧩 New client connected:', socket.id);

  // Send current state to the newly connected client (OBS, etc.)
  socket.emit('updatePairs', latestLinkedPairs);

  // Receive updates from the main client
  socket.on('updatePairs', (pairs) => {
    latestLinkedPairs = pairs;
    console.log('🔁 Received updated pairs:', pairs);
    io.emit('updatePairs', latestLinkedPairs); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
