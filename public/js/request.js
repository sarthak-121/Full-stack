const displayRequests = (data) => {

    let sendedStr = `<h2>Sended</h2>`
    let recievedStr = `<h2>Recieved</h2>`

    data.sended.forEach(user => {
        if(user === '_sended') return
        sendedStr += `<div class=requests-list>
                     ${user}
                     <button class="add-button">Stop</button>
                     </div>` 
    })

    data.recieved.forEach(user => {
        if(user === '_recieved') return
        recievedStr += `<div class=requests-list>
                        ${user}
                        <button class="add-button">Reject</button>
                        <button class="add-button">Accept</button>
                        </div>`
    })

    if(data.sended.length > 1){
        document.getElementById('sended-box').innerHTML = sendedStr
    } 
    if(data.recieved.length > 1) {
        document.getElementById('recieved-box').innerHTML = recievedStr
    }   

}


const getRequests = async () => {
    const response = await fetch('/getRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user.username
        })
    })

    if(response.status === 500) {
        return
    }

    const data = await response.json()
    displayRequests(data)
}


const user = JSON.parse(sessionStorage.getItem('user'))

if(user == undefined) {
    location.href = '/index.html'
} else {
    getRequests()
}


document.getElementById('user-circle-toggle-button').addEventListener('click', () => {
    const dropDownMenue = document.getElementsByClassName('drop-down-menue')[0]
    const css = dropDownMenue.currentStyle || window.getComputedStyle(dropDownMenue)

    if(css.display === 'none') {
        dropDownMenue.style.display = "block"
    } else {
        dropDownMenue.style.display = "none"
    }    
})