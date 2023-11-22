const load = () => {
    const socket = io();
    const usersMain = document.querySelectorAll('.user_div')
    const names = document.querySelectorAll('.user_p')
    const marker = document.querySelectorAll('.marker')

    socket.on('enter', connectionCount => {
        names.forEach((name, key) => {
            name = name.textContent.trim()
            if (Object.keys(connectionCount).includes(name)) {
                marker[key].classList.add('online')
            }
        })
    })

    const usersWrapper = document.querySelector('.users')
    const users = document.querySelectorAll('.user_div')

    if(users.length === 2) {
        usersWrapper.style.cssText = 'max-width: 455px !important;'
    }
    if(users.length === 1) {
        usersWrapper.style.cssText = 'max-width: 240px !important;'
    }
}

window.addEventListener('load', load)