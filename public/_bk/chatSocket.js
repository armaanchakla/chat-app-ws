const currentUser = "<%= user %>";
const socket = new WebSocket("ws://localhost:3000");

socket.onmessage = (e) => {
  const msg = JSON.parse(e.data);

  // Only show messages addressed to current user
  if (msg.to !== currentUser) return;

  const messagesDiv = document.getElementById("messages");
  const messageElem = document.createElement("div");
  messageElem.className = "message received";
  messageElem.textContent = msg.text;
  messagesDiv.prepend(messageElem);
};

function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  const messagesDiv = document.getElementById("messages");
  const messageElem = document.createElement("div");
  messageElem.className = "message sent";
  messageElem.textContent = text;
  messagesDiv.prepend(messageElem);

  const msgTo = currentUser === "admin" ? "armaan" : "admin";

  socket.send(JSON.stringify({ text, from: currentUser, to: msgTo }));
  input.value = "";
}
