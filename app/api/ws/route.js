import { Server } from 'socket.io';

let io;

export async function GET(request) {
  if (!global.io) {
    // Initialize Socket.IO server
    const { createServer } = require('http');
    const { Server } = require('socket.io');
    
    const httpServer = createServer();
    global.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    global.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Start the WebSocket server on a different port
    httpServer.listen(3101, () => {
      console.log('WebSocket server listening on port 3101');
    });
  }

  return new Response(JSON.stringify({ message: 'WebSocket server initialized' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Export the io instance for use in other files
export function getSocketIO() {
  return global.io;
}