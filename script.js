// Ye wahi URL hai jo aapne screenshot mein dikhaya
const socket = io("https://chat-tr1m.onrender.com");

let myName = "";

function joinChat() {
    myName = document.getElementById("username").value;
    if (myName) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat").classList.remove("hidden");
    }
}

function sendMsg() {
    const input = document.getElementById("msg-input");
    if (input.value) {
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
    div.className = `msg ${data.user === myName ? "sent" : "received"}`;
    div.innerHTML = `<strong>${data.user}</strong><br>${data.text}<br><small style="font-size:8px; opacity:0.6; float:right;">${data.time}</small>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
