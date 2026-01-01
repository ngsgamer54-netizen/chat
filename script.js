// Firebase Config (From your Screenshot)
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

// Socket Connection
const socket = io("https://chat-tr1m.onrender.com");
let myName = "";
let myPhoto = "";

// Google Login Button Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('google-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    myName = user.displayName;
                    myPhoto = user.photoURL;

                    // Switch Screens
                    document.getElementById("login").classList.add("hidden");
                    document.getElementById("chat-ui").classList.remove("hidden");
                    
                    // Set Profile Photo
                    document.getElementById("user-avatar").src = myPhoto;
                }).catch((error) => {
                    console.error("Login Failed:", error);
                    alert("Please authorize your domain in Firebase settings first!");
                });
        });
    }
});

// Send Message
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

// Enter Key Support
document.getElementById("msg-input")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMsg();
});

// Receive Message
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
