const displayPeopleList = async (data, userdata) => {   
    const body = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userdata.username
        })
    }
    
    const response = await fetch('/getRequest', body)
    const requests = await response.json()

    if(response.status !== 200)
    
    requests.sended.forEach(user => {
        if(user === '_sended') return

        data.splice(data.indexOf(user), 1)
    })

    requests.recieved.forEach(user => {
        if(user === '_recieved') return

        data.splice(data.indexOf(user), 1)
    })

    const contactsList = document.getElementById('people-list')
    let str = `<h2>PEOPLE</h2>` 

    data.forEach(user => {
        if(user === userdata.username) {
          return
        }

        if(user.length > 30) {
            user = user.slice(0,26) + '...'
         }

        str = str + `<div class="list">${user}<button class="add-button">Add</button></div>`  
    })

    contactsList.innerHTML = str
}


const socketHandler = (data, userdata) => {
    const socket = io()

    let username = userdata.username
    if(username.length > 18) {
       username = username.slice(0,15) + '...'
    }

    const userInfo = document.getElementById('user-info')
    userInfo.innerHTML = `<h1>Hi,<img src='image/avatar.jpg' alt='avatar' class='user-image'></h1>
                            <h1>${username}</h1>`

    displayPeopleList(data, userdata)

    const addButton = document.getElementsByClassName('add-button')

    for(let i = 0 ; i < addButton.length ; i++) {
        addButton[i].addEventListener('click', () => {
            console.log("button worked")
        })
    }

    const lists = document.getElementsByClassName('list')


    console.log(lists)
    console.log(typeof(lists))

    for(let i = 0 ; i < lists.length ; i++) {    
        console.log(typeof(lists[i]))
        lists[i].addEventListener('click', async () => {
            console.log("working?")
            // let requests = []
            
            // if(JSON.parse(localStorage.getItem('requests'))) {
            //     requests  = JSON.parse(localStorage.getItem('requests'))
            // }

            const data = list[i].innerHTML.replace('<button class="add-button">Add</button>', '')

            // requests.push(data)
            // localStorage.setItem('requests', JSON.stringify(requests))

            const body = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userdata.username,
                    request: data
                })
            }

            const response = await fetch('/request', body)
            if(response.status === 200) {
                location.reload()
            }
        })
    }
    
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


const checkForUser = async (user) => {
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
        } else {
            return window.location.href = '/signup.html'
        }
}

const user = JSON.parse(sessionStorage.getItem('user'))

checkForUser(user)


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
    const dropDownMenue = document.getElementsByClassName('drop-down-menue')[0]
    const css = dropDownMenue.currentStyle || window.getComputedStyle(dropDownMenue)

    if(css.display === 'none') {
        dropDownMenue.style.display = "block"
    } else {
        dropDownMenue.style.display = "none"
    }    
})

document.getElementById('request-button').addEventListener('click', () => {
    location.href = './request.html'
})