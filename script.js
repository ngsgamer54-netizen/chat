const socket = io("https://chat-tr1m.onrender.com");

let myName = "";

function joinChat() {
    const input = document.getElementById("username");
    myName = input.value.trim();
    if (myName) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat").classList.remove("hidden");
    }
}

function sendMsg() {
    const input = document.getElementById("msg-input");
    if (input.value.trim()) {
        socket.emit("send_message", { 
            user: myName, 
            text: input.value,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        input.value = "";
    }
}

socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    
    const isMe = data.user === myName;
    div.className = `msg ${isMe ? "sent" : "received"}`;
    
    div.innerHTML = `
        <small style="display:block; font-size:10px; color:#7E57C2; font-weight:bold;">${data.user}</small>
        ${data.text}
        <small style="display:block; font-size:8px; text-align:right; opacity:0.6; margin-top:4px;">${data.time}</small>
    `;
    
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
