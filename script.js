const socket = io("https://chat-tr1m.onrender.com");
let myName = "User";

function joinChat() {
    // Demo ke liye hum prompt use karenge, baad mein aap Firebase use kar sakte hain
    const person = prompt("Please enter your name for Google Login simulation:", "John Doe");
    
    if (person != null && person != "") {
        myName = person;
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat-ui").classList.remove("hidden");
        console.log("Logged in as:", myName);
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

socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    const isMe = data.user === myName;
    div.className = `message-box ${isMe ? "my-message" : "friend-message"}`;
    div.innerHTML = `<p><b style="font-size: 0.8em; color: #075e54;">${isMe ? "You" : data.user}</b><br>${data.text}<br><span style="font-size: 0.7em; float: right; opacity: 0.5;">${data.time}</span></p>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
