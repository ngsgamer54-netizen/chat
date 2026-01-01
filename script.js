// Aapka Render Backend Link yahan add kar diya gaya hai
const socket = io("https://chat-tr1m.onrender.com");

let myName = "";

// Chat Join karne ka function
function joinChat() {
    const nameInput = document.getElementById("username");
    myName = nameInput.value.trim();
    
    if (myName !== "") {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat").classList.remove("hidden");
        console.log("Joined as: " + myName);
    } else {
        alert("Please enter your name!");
    }
}

// Message bhejne ka function
function sendMsg() {
    const input = document.getElementById("msg-input");
    const messageText = input.value.trim();
    
    if (messageText !== "") {
        // Socket ke zariye message bhejna
        socket.emit("send_message", { 
            user: myName, 
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        input.value = "";
    }
}

// Enter key se message bhejne ke liye
document.getElementById("msg-input")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMsg();
    }
});

// Jab server se koi naya message aaye
socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    
    // Check karna ki message maine bheja hai ya kisi aur ne (Styling ke liye)
    const isMe = data.user === myName;
    div.className = `msg ${isMe ? "sent" : "received"}`;
    
    div.innerHTML = `
        <strong style="font-size: 10px; color: #7E57C2;">${data.user}</strong>
        <p style="margin: 2px 0;">${data.text}</p>
        <span style="font-size: 8px; float: right; opacity: 0.6;">${data.time || ""}</span>
    `;
    
    box.appendChild(div);
    
    // Scroll ko hamesha niche rakhna
    box.scrollTop = box.scrollHeight;
});
