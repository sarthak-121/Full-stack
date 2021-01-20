document.getElementById("login-button").addEventListener('click', async () => {

    const credential = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try {
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credential)
        }

        const response = await fetch('/login', body)
        const status = response.status
        if(status === 400) {
            document.getElementById("error-msg").style.display = "block"
            document.getElementById("error-msg").innerHTML = "Did not match :("
        }

        const data = await response.json()

        if(status === 200) {
            sessionStorage.setItem('user', JSON.stringify(data))
            window.location.href = "https://full-stack-chat-app-121.herokuapp.com/"
        } 
    } catch(e) {
        console.log(e)
    }
})