const { Server } = require('socket.io');
const events = require('./events');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);
    
    // Send initial connection status
    socket.emit('connection-status', {
      status: 'connected',
      clientId: socket.id,
      timestamp: new Date().toISOString()
    });

    // Register all event handlers
    events(io, socket);

    socket.on('disconnect', (reason) => {
      console.log('🔴 Client disconnected:', socket.id, 'Reason:', reason);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  return io;
};

module.exports = initializeSocket;