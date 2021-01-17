document.getElementById('submit-button').addEventListener('click', async (e) => {

    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    const errorMsg = document.getElementById('error-msg')

    if(userData.password !== document.getElementById('confirm-password').value) {
        errorMsg.style.display = "block"
        errorMsg.innerHTML = "passwords do not match"
    }else {
        try {
            const body = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            }
            const response = await fetch('/signup', body)
            const status = response.status
            const data = await response.json()
           
            if(status === 201) {
                sessionStorage.setItem('user', JSON.stringify(data))
                window.location.href = "http://localhost:3000"
            } else {
                errorMsg.innerHTML = "try again :("
            }
        } catch(e) {
            console.log(e)
        }
    }
})