const load = () => {
    const socket = io(),
        form = document.querySelector("#mess-form"),
        textarea = document.querySelector("#message"),
        submit = document.querySelector(".submit"),
        address = new URL(window.location),
        guest = address.searchParams.get('id'),
        cookies = document.cookie.split(";"),
        connectionCount = document.querySelector('.connectionCount'),
        messagesWrapper = document.querySelector('.all_mess'),
        htmlName = document.querySelector('.pska2').textContent.replace(/\n/g, '').trim()
    let name = ''

    cookies.forEach(cookie => {
        if (cookie.split('=')[0] === 'name') name = cookie.split('=')[1]
    })

    if (name !== htmlName) window.location.replace(new URL(window.location).origin)

    socket.on('enter', connectionCountServer => {
        if (Object.keys(connectionCountServer).includes(guest)) {
            connectionCount.textContent = 'Online'
        }
        else {
            connectionCount.textContent = 'Offline'
        }
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(name === "" || textarea.value === "") return;

        socket.emit('send', {text: textarea.value, name, guest});
        textarea.value = '';
    })

    const keyDownUp = () => {
        if(textarea.value === "") {
            submit.style.transform = "scale(0)"
            submit.style.transition = "all 0.3s"
        }
        else {
            submit.style.transform = "scale(1)"
        }
    }

    textarea.addEventListener('keyup', keyDownUp)
    textarea.addEventListener('keydown', keyDownUp)

    socket.on('give', ({name, text}) => {
        const count = document.querySelectorAll('.user_mess').length + 2
        const some = document.querySelector('.some')
        const link = document.createElement('a')
        const paragraf = document.createElement('p')

        link.classList.add('user_mess')
        link.href = `/profile?login=${name}`
        link.textContent = name

        paragraf.classList.add('some_p')
        paragraf.textContent = text

        messagesWrapper.insertBefore(link, some)
        messagesWrapper.insertBefore(paragraf, some)

        if(count < 11) {
            document.body.style.overflow = 'hidden'
            window.scrollTo(0, document.body.scrollHeight)
        }

        else if (count === 1) {
            document.body.style.overflow = 'hidden'
            window.scrollTo(0, document.body.scrollHeight)

            const massager = document.querySelector('.messages')
            massager.style.bottom = '20%'
        }
        
        else {
            window.scrollTo(0, document.body.scrollHeight)
            const massager = document.querySelector('.messages')
            massager.style.bottom = '85%'
            document.body.style.overflow = 'auto'
        }
    })
}

window.addEventListener('load', load)