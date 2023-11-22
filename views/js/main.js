const load = () => {
    const submit = document.querySelector(".submit")
    const login = document.querySelector('.pska2').textContent.trim()
    const socket = io();
    const form = document.querySelector('#mess-form');
    const textarea = document.querySelector('#message');
    const connections = document.querySelector('.connectionCount span')
    const messagesWrapper = document.querySelector('.all_mess')

    socket.on('enter', connectionCount => {
        connections.textContent = String(Object.keys(connectionCount).length)
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

    form.addEventListener('submit',  (event) => {
        event.preventDefault();

        if(textarea.value === "") return

        if(login === "" || textarea.value === "") return;

        socket.emit('send mess', {text: textarea.value, name: login});
        socket.emit('count')

        textarea.value = '';        
    });

    socket.on('add mess',  ({name, text}) => {
        const count = document.querySelectorAll('.user_mess').length + 1
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

        if(count + 1 < 11) {
            document.body.style.overflow = 'hidden'
            window.scrollTo(0, document.body.scrollHeight)
        }

        else if (count + 1 === 1) {
            document.body.style.overflow = 'hidden'
            const wind = document.body.scrollHeight
            window.scrollTo(0, wind)
            document.querySelector('.messages').style.bottom = '20%'
        }
      
        else {
            window.scrollTo(0, document.body.scrollHeight)
            document.querySelector('.messages').style.bottom = '85%'
            document.body.style.overflow = 'auto'
        }
    });
}

  window.addEventListener('load', load)