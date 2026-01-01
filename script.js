// Aapka Render Backend Connection
const socket = io("https://chat-tr1m.onrender.com");

let myName = "";

// Chat Join karne ka function (WhatsApp Login Style)
function joinChat() {
    const input = document.getElementById("username");
    myName = input.value.trim();
    
    if (myName !== "") {
        // Login screen chhupao aur Chat UI dikhao
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chat-ui").classList.remove("hidden");
        console.log("Joined as: " + myName);
    } else {
        alert("Please enter your name to start chatting!");
    }
}

// Message bhejne ka function
function sendMsg() {
    const input = document.getElementById("msg-input");
    const messageText = input.value.trim();
    
    if (messageText !== "") {
        const msgData = { 
            user: myName, 
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Server ko message bhejna
        socket.emit("send_message", msgData);
        
        // Input box khali karna
        input.value = "";
    }
}

// Enter key se message bhejne ka feature
document.getElementById("msg-input")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMsg();
    }
});

// Jab server se koi naya message aaye (Receive Message)
socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    
    // Check karna ki message 'Mera' hai ya 'Dost' ka
    const isMe = data.user === myName;
    
    // WhatsApp Style Classes: 'my-message' (Right) aur 'friend-message' (Left)
    div.className = `message-box ${isMe ? "my-message" : "friend-message"}`;
    
    div.innerHTML = `
        <p>
            <b style="font-size: 0.75em; color: ${isMe ? '#075e54' : '#e91e63'}; display: block; margin-bottom: 2px;">
                ${isMe ? "You" : data.user}
            </b>
            ${data.text}
            <span style="display: block; font-size: 0.7em; opacity: 0.5; text-align: right; margin-top: 5px;">
                ${data.time}
            </span>
        </p>
    `;
    
    // Chat box mein message add karna
    box.appendChild(div);
    
    // Automatically niche scroll karna
    box.scrollTop = box.scrollHeight;
});
