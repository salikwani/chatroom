const socket = io();

var username = "";
var chatRoom = document.getElementById("chatroom");
var mainPage = document.getElementById("main-page");
var messages = document.getElementById("messages");

var joinChat = document.getElementById("user-input");
joinChat.addEventListener("submit", (event)=> {
    event.preventDefault();

    username = document.getElementById("username").value;
    if(username.trim() != "") {
        mainPage.style.display = "none";
        chatRoom.style.display = "flex";
        var hname = document.createElement("p");
        hname.setAttribute("id","heading");
        hname.innerText = `Chatroom - ${username}`;
        document.querySelector(".header").prepend(hname);
        document.getElementById("username").value = "";

        socket.emit("username enter", username);
    } else {
        alert("Username cannot be empty");
    }    
});

socket.on("username enter", (data) => {
    if(data !== username) {
        var infoDiv = document.createElement("div");
        infoDiv.innerHTML = `<em>${data} has joined the conversation</em>`;
        infoDiv.setAttribute("class","center");
        messages.appendChild(infoDiv);
    }
});

document.getElementById("exit-btn").addEventListener("click", () => {
    socket.emit("username left", username);
    mainPage.style.display = "flex";
    chatRoom.style.display = "none";
    messages.innerHTML = '';
    document.querySelector("#heading").remove();
});

socket.on("username left", (data) => {
    if(data !== username) {
        var infoDiv = document.createElement("div");
        infoDiv.innerHTML = `<em>${data} has left the conversation</em>`;
        infoDiv.setAttribute("class","center");
        messages.appendChild(infoDiv);
    }
});


document.querySelector(".footer").addEventListener("submit", (event)=> {
    event.preventDefault();
    var msg = document.getElementById("input-message").value.trim();
    if(msg === "") {
        alert("Enter Message");
    } else {
        var data = {
            username: username,
            message: msg
        };
        socket.emit("message", data);
        addMessage(data,true);
        document.getElementById("input-message").value = "";
    }
});

socket.on("message", (data)=> {
    if(data.username !== username) {
        addMessage(data,false);
    }
});

function addMessage(data, flag) {
    var msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<sup>${data.username}</sup><br><p>${data.message}</p>`;
    if(flag) {
        msgDiv.setAttribute("class","message sent");
    } else {
        msgDiv.setAttribute("class","message received");
    }
    messages.appendChild(msgDiv);
}



