//--------------------------------------------------------------------
// Socket IO Client Events 
//--------------------------------------------------------------------
window.onload = () => {
    const userHash = {
        id: ""
    }
    const roomState = {
        currentMessage: "",
        receivedMessage: ""
    }
    const io = require('socket.io-client')
    const socket = io("http://127.0.0.1:5000")

    const display = document.querySelector('.messages-display')
    const input = document.querySelector('.messages-input input')
    const button = document.querySelector('.messages-input button')

    const addMessageToChat = (msg, serverClientId, clientClientId) => {
        const senderName = document.createElement('div')
        senderName.classList.add('sender-name')
        const msgContainer = document.createElement('div')
        msgContainer.classList.add('message-container')

        if (serverClientId == clientClientId) {
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
        console.log("Server sending message: [%s]", roomData["message"])
        addMessageToChat(roomData["message"], roomData["id"], userHash.id)
    })

    socket.on("page_reload", messages => {
        console.log("PAGE RELOAD")
        messages.forEach(roomData => {
            addMessageToChat(roomData["message"], roomData["id"], userHash.id)
        })
    })
}
