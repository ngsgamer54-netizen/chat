// Firebase Configuration (From your screenshot)
const firebaseConfig = {
  apiKey: "AIzaSyCRB3ghMxx-nq1tLIXVGPj53ZdlN_W1zbI",
  authDomain: "mywhatsappclone-12e96.firebaseapp.com",
  projectId: "mywhatsappclone-12e96",
  storageBucket: "mywhatsappclone-12e96.firebasestorage.app",
  messagingSenderId: "131666791116",
  appId: "1:131666791116:web:fe41ca039c1bd9a774d069",
  measurementId: "G-JM6YZYB90D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Socket.io Connection (Aapka Render Backend)
const socket = io("https://chat-tr1m.onrender.com");

let myName = "";
let myPhoto = "";

// Google Login Function
document.getElementById('google-login-btn').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            myName = user.displayName;
            myPhoto = user.photoURL;

            // Login screen chhupao aur Chat UI dikhao
            document.getElementById("login").classList.add("hidden");
            document.getElementById("chat-ui").classList.remove("hidden");
            
            // Profile picture set karein
            const avatarImg = document.getElementById("user-avatar");
            avatarImg.src = myPhoto;
            avatarImg.style.display = "block";
            
            console.log("Welcome:", myName);
        }).catch((error) => {
            console.error("Login Error:", error);
            alert("Login Failed! Make sure you added your domain in Firebase settings.");
        });
});

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
        socket.emit("send_message", msgData);
        input.value = "";
    }
}

// Enter key support
document.getElementById("msg-input")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMsg();
});

// Receive Message logic
socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");
    const isMe = data.user === myName;
    
    div.className = `message-box ${isMe ? "my-message" : "friend-message"}`;
    div.innerHTML = `
        <p>
            <b style="font-size: 0.75em; color: #075e54; display: block;">${isMe ? "You" : data.user}</b>
            ${data.text}
            <span style="display: block; font-size: 0.7em; opacity: 0.5; text-align: right; margin-top: 5px;">${data.time}</span>
        </p>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});
