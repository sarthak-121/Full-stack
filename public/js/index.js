const socketHandler = (data, userdata) => {
    const socket = io()
    
    const contactsList = document.getElementById('contacts-list')
    let str = `<h1>CONTACTS</h1>` 

    data.forEach(user => {
        if(user === userdata.username) {
          return
        }
        str = str + `<div class="list"><a href="#">${user}</a></div>`  
    })

    contactsList.innerHTML = str
    let chats =  document.getElementById('chat')

    socket.on('welcomeMessage', (msg) => {
        console.log(msg)
    })

    socket.on('messageSend', (msg) => {
        chats.innerHTML = chats.innerHTML + `<div class="message_user"><p>${msg}</p></div>`
    })

    const sendButton = document.getElementById('send')

    sendButton.addEventListener('click', () => {
        let msg = document.getElementById('msg').value
        chats.innerHTML = chats.innerHTML +  `<div class="message_recieved"><p>${msg}</p></div>`

        socket.emit('messageRecieved', msg)
    })
}


const checkForUser = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if(!user) {
        return  window.location.href = "https://full-stack-chat-app-121.herokuapp.com/signup.html"  
    }

    const body = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": user.email,
            "password": user.password
        })
    }
        const response = await fetch('/app', body)
        const status = response.status
        const data = await response.json()
        
        if(status === 200) {
            socketHandler(data, user)
        }
}

checkForUser()

