// WebSocket server is now integrated with the main Next.js server
// No separate initialization needed

export async function GET(request) {
  // Check if WebSocket server is available
  if (global.io) {
    return new Response(JSON.stringify({ 
      message: 'WebSocket server is ready',
      connected: global.io.engine.clientsCount || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ 
      message: 'WebSocket server not initialized',
      error: 'Server starting up, please try again'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Export the io instance for use in other files
export function getSocketIO() {
  return global.io;
}