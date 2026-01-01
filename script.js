const socket = io("http://localhost:5000");
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
        socket.emit("send_message", { user: myName, text: input.value });
        input.value = "";
    }
}

socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = `msg ${data.user === myName ? "sent" : "received"}`;
    div.innerHTML = `<strong>${data.user}</strong><br>${data.text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
