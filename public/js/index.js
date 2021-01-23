const socketHandler = (data, userdata) => {
    const socket = io()

    const userInfo = document.getElementById('user-info')
    userInfo.innerHTML = `<h1>Hi,<img src='image/avatar.jpg' alt='avatar' class='user-image'></h1>
                            <h1>${userdata.username}</h1>`
    
    const contactsList = document.getElementById('people-list')
    let str = `<h2>PEOPLE</h2>` 

    data.forEach(user => {
        if(user === userdata.username) {
          return
        }
        str = str + `<div class="list">${user}<button class="add-button">Add</button></div>`  
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
        let msg = document.getElementById('msg')
        if(msg.value !== "") {
            chats.innerHTML = chats.innerHTML +  `<div class="message_recieved"><p>${msg.value}</p></div>`
            socket.emit('messageRecieved', msg.value)
            msg.value = ''
        }
    })
}


const checkForUser = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if(!user) {  
        return window.location.href = '/signup.html'
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


addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        document.getElementsByClassName('send-button')[0].click()
    }
})

document.getElementById('side-bar-toggle').addEventListener('click', () => {
    const sideBar = document.getElementsByClassName('side-bar')[0]
    const css = sideBar.currentStyle || window.getComputedStyle(sideBar)

    if(window.screen.availWidth < 1024) {
        sideBar.style.width = "150%"
    } else {
        sideBar.style.width = "25%"
    }

    if(css.marginLeft === "0px") {
        if(window.screen.availWidth < 1024) {
            sideBar.style.marginLeft = "-150%"
        } else {
            sideBar.style.marginLeft = "-25%"
        }
    } else {
        sideBar.style.marginLeft = "0px"
    }

    console.log(window.screen.availHeight, window.screen.availWidth)
})

document.getElementById('user-circle-toggle-button').addEventListener('click', () => {
    console.log("worked")
    const dropDownMenue = document.getElementsByClassName('drop-down-menue')[0]
    dropDownMenue.style.display = "block" 
})