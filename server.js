const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

let clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);
  console.log("Client connected. Total:", clients.length);

  ws.on("message", function incoming(message) {
    // Forward incoming audio data to all connected clients
    clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Client disconnected. Total:", clients.length);
  });
});

// Route for stream test
app.get("/", (req, res) => {
  res.send("WebSocket Audio Server is running.");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
