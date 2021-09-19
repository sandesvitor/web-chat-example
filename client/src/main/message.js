//--------------------------------------------------------------------
// Innitializations
//--------------------------------------------------------------------
const userHash = {}
const roomState = {
    currentMessage: "",
    receivedMessage: ""
}
const io = require('socket.io-client')
const socket = io("http://localhost:5000/")

const display = document.querySelector('.messages-display')
const input = document.querySelector('.messages-input input')
const button = document.querySelector('.messages-input button')

const addMessageToChat = (msg, clientId) => {
    console.log("Server sending message: [%s]", msg)
    const senderName = document.createElement('div')
    senderName.classList.add('sender-name')
    const msgContainer = document.createElement('div')
    msgContainer.classList.add('message-container')

    if (clientId == userHash.id) {
        msgContainer.setAttribute('sender', 'me')
    } else {
        msgContainer.setAttribute('sender', 'other')
    }

    const msgUnit = document.createElement('div')
    msgUnit.classList.add('message')
    msgUnit.innerText = msg

    msgContainer.appendChild(senderName)
    msgContainer.appendChild(msgUnit)

    display.appendChild(msgContainer)

    display.scrollTop = display.scrollHeight
}

//--------------------------------------------------------------------
// Socket IO Client Events 
//--------------------------------------------------------------------
window.onload = () => {
    socket.on("connect", () => {
        socket.send("User connected!")
    })

    socket.on("who_am_i", client_id => {
        console.log("Socket Client ID: [%s]", client_id["data"])
        userHash.id = client_id["data"] 
    })

    button.addEventListener("click", e => {
        e.preventDefault()
        socket.emit("send_message", input.value)
        input.value = ""
    })    
    
    socket.on("get_message", roomData => {
        addMessageToChat(roomData["message"], roomData["id"])
    })

    socket.on("message", msgs => {
        msgs.forEach(msg => {
            addMessageToChat(msg, userHash.id)
        })
    })
}
