// Firebase Configuration from your screenshot
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

// Yeh function page load hote hi chalega
window.addEventListener('load', function() {
    const loginBtn = document.getElementById('google-login-btn');
    
    if (loginBtn) {
        // Direct click event listener
        loginBtn.addEventListener('click', function() {
            console.log("Button click detected!");
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    myName = user.displayName;
                    myPhoto = user.photoURL;

                    document.getElementById("login").classList.add("hidden");
                    document.getElementById("chat-ui").classList.remove("hidden");
                    document.getElementById("user-avatar").src = myPhoto;
                    
                    console.log("Logged in as:", myName);
                })
                .catch((error) => {
                    console.error("Auth Error:", error);
                    alert("Google Login Error: " + error.message);
                });
        });
    } else {
        console.error("ERROR: Button with ID 'google-login-btn' not found!");
    }
});

// Send Message
function sendMsg() {
    const input = document.getElementById("msg-input");
    if (input && input.value.trim() !== "") {
        const msgData = {
            user: myName,
            text: input.value,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        socket.emit("send_message", msgData);
        input.value = "";
    }
}

// Receive Message
socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    if (!box) return;
    
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
