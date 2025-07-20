// Create two WebSocket connections
const socket1 = new WebSocket('ws://localhost:3000');
// const socket2 = new WebSocket('ws://localhost:3000');

// Setup listeners for socket1
socket1.onopen = () => console.log('Socket1 connected');
socket1.onmessage = (e) => {
    const msg = JSON.parse(e.data);

    if (msg.from === 1) {
        appendMessage('messages' + 2, msg.text, 'received');
    } else if (msg.from === 2) {
        appendMessage('messages' + 1, msg.text, 'received');
    }
};
socket1.onerror = (e) => console.error('Socket1 error', e);

// Setup listeners for socket2
// socket2.onopen = () => console.log('Socket2 connected');
// socket2.onmessage = (e) => {
//     const msg = JSON.parse(e.data);

//     if (msg.from === 1) {
//         appendMessage('messages' + 1, msg.text, 'received');
//     } else if (msg.from === 2) {
//         appendMessage('messages' + 2, msg.text, 'received');
//     }
// };
// socket2.onerror = (e) => console.error('Socket2 error', e);

// Send message from the corresponding chat
function sendMessage(id) {
    const input = document.getElementById(`input${id}`);
    const text = input.value.trim();
    if (!text) return;

    appendMessage(`messages${id}`, text, 'sent');

    if(socket1.readyState === WebSocket.OPEN) {
        socket1.send(JSON.stringify({
            from: id,
            text: text
        }));
    };

    // if (id === 1 && socket1.readyState === WebSocket.OPEN) {
    
    // } else if (id === 2 && socket2.readyState === WebSocket.OPEN) {
    // socket2.send({
    //         from: id,
    //         text: text
    //     });
    // }

    input.value = '';
}

// Append message to the chat
function appendMessage(containerId, text, type) {
    const container = document.getElementById(containerId);
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    container.prepend(msg);
}



// Get the input field
document.getElementById('input1').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    sendMessage(1);
  }
});

document.getElementById('input2').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    sendMessage(2);
  }
});