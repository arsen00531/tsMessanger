const load = () => {
    const socket = io(),
        form = document.querySelector("#mess-form"),
        textarea = document.querySelector("#message"),
        submit = document.querySelector(".submit"),
        address = new URL(window.location),
        guest = address.searchParams.get('id'),
        cookies = document.cookie.split(";"),
        connectionCount = document.querySelector('.connectionCount')
        htmlName = document.querySelector('.pska2').textContent.replace(/\n/g, '').trim()
    let name = ''

    cookies.forEach(cookie => {
        if (cookie.split('=')[0] === 'name') name = cookie.split('=')[1]
    })

    if (name !== htmlName) window.location.replace('http://localhost:3000/')

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

    document.querySelector('.account_not_log').addEventListener("click", (e) => {
        e.preventDefault()
        const regLog = document.querySelector('.reg_and_log')

        if (regLog.classList.length === 2) regLog.classList.remove('clicked')
        else regLog.classList.add('clicked')
    })

    socket.on('give', (data) => {
        const {name, text, count} = data
        const some = $('.some')

        some.before(`<a class='user_mess'>${name}</a>`);
        some.before(`<p class='some_p'>${text}</p>`)

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