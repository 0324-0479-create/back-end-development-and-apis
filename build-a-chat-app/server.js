import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// User Story 1: HTTP server that serves the chat page
const server = http.createServer((req, res) => {
  const html = fs.readFileSync("./public/index.html");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

// User Story 2: WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ server });

// Sends a message to every connected client
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// User Story 3: connection listener
wss.on("connection", (socket, req) => {
  // User Story 4: read the username from the URL and announce the join
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  broadcast({ type: "system", text: `${username} joined` });

  // User Story 5: relay chat messages to everyone, including the sender
  socket.on("message", (data) => {
    const { username, text } = JSON.parse(data.toString());
    broadcast({ type: "chat", username, text });
  });

  // User Story 6: announce when the client leaves
  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

// User Story 7: start the server
server.listen(PORT, () => {
  console.log("Chat server running at http://localhost:3001");
});