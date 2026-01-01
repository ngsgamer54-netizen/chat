const socket = io("https://chat-tr1m.onrender.com");
let myName = "";

function joinChat() {
    const input = document.getElementById("username");
    myName = input.value.trim();
    if (myName) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat-ui").classList.remove("hidden");
    }
}

function sendMsg() {
    const input = document.getElementById("msg-input");
    if (input.value.trim()) {
        const msgData = {
            user: myName,
            text: input.value,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        socket.emit("send_message", msgData);
        input.value = "";
    }
}

// Enter key support
document.getElementById("msg-input")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMsg();
});

socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    const isMe = data.user === myName;

    div.className = `message-box ${isMe ? "my-message" : "friend-message"}`;
    div.innerHTML = `
        <p>
            <b style="font-size: 0.75em; color: #075e54; display: block;">${isMe ? "You" : data.user}</b>
            ${data.text}
            <span>${data.time}</span>
        </p>
    `;
    
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
