const checkForUser = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log(user)
    if(!user) {
        return  window.location.href = "http://localhost:3000/signup.html"  
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
        console.log(response)
        // const status = response.status
        // const data = await response.json()
}

checkForUser()

const socket = io()

socket.on('welcomeMessage', (msg) => {
    console.log(msg)
})

socket.on('messageSend', (msg) => {
    console.log(msg)
})

const sendButton = document.getElementById('send')
const userMsg = document.getElementsByClassName('message_user')
const recieveMsg = document.getElementsByClassName('message_recieved')

sendButton.addEventListener('click', () => {
    const msg = document.getElementById('msg').value
    console.log(msg)

    socket.emit('messageRecieved', msg)
})

