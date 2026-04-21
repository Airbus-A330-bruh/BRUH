// "unique" id? no
// sorry for the cringe name lol
const randomNum = Math.floor(Math.random() * 1000);
const peer = new Peer('test-id-' + Math.floor(Math.random() * 1000), { // random id generation
  config: {
    'iceServers': [
      { urls: 'stun:stun.l.google.com:19302' }, 
      { urls: 'stun:stun1.l.google.com:19302' }                        // stun servers to fix device communication i think
    ]
  }
});

// share ur id to be even more vulnerable yay
peer.on('open', (id) => {
  document.getElementById('my-id').innerText = id;
  updateStatus();
});
peer.on('open', id => console.log("PEER OPEN:", id));
peer.on('error', err => console.error("PEER ERROR:", err));


let conn;
peer.on('connection', (incomingConn) => {
  conn = incomingConn;
  updateStatus();
  setupChat();
});


function connectToPeer() {
  const remoteId = document.getElementById("peerIdInput").value;

  console.log("Attempting connection to:", remoteId);

  conn = peer.connect(remoteId);

  conn.on('open', () => {
    console.log("CONNECTED");
    updateStatus();
    setupChat(); // only here
  });

  conn.on('error', (err) => {
    console.error("Connection error:", err);
  });

  conn.on('close', () => {
    console.log("Connection closed");
    updateStatus();
  });
}
function setupChat() {
  conn.on('data', (data) => {
   
    document.getElementById("output").innerHTML += "<div>Peer sent: " + data + "</div>";
  });
  
  conn.on('close', function() {
    updateStatus();
  });
}


function inject() {
  const userInput = document.getElementById("xssInput").value;
  
  // show it on screen
  document.getElementById("output").innerHTML += "<div>You: " + userInput + "</div>";

  // If connected, send input to peer
  if (conn && conn.open) {
    conn.send(userInput);
  }


}

// Update status display function
function updateStatus() {
  document.getElementById('status-my-id').textContent = peer.id || 'Loading...';
  document.getElementById('status-connected').textContent = (conn && conn.open) ? 'Yes' : 'No';
  document.getElementById('status-remote-id').textContent = (conn && conn.open) ? conn.peer : 'None';
}
