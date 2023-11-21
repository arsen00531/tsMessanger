const load = () => {
    const submit = document.querySelector(".submit")
    const login = document.querySelector('.pska2').textContent.trim()
    const socket = io();
    const form = document.querySelector('#mess-form');
    const textarea = document.querySelector('#message');
    const connections = document.querySelector('.connectionCount span')

    socket.on('enter', connectionCount => {
        connections.textContent = String(connectionCount)
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

        socket.emit('send mess', {mess: textarea.value, name: login});
        socket.emit('count')

        textarea.value = '';        
    });

    socket.on('add mess',  (data) => {
        const some = $('.some')
        some.before(`<a class='user_mess' href='/profile?login=${data.name}'>${data.name}</a>`);
        some.before(`<p class='some_p'>${data.mess}</p>`)

        if(data.count + 1 < 11) {
            document.body.style.overflow = 'hidden'
            window.scrollTo(0, document.body.scrollHeight)
        }
      
        else {
            window.scrollTo(0, document.body.scrollHeight)
            document.querySelector('.messages').style.bottom = '85%'
            document.body.style.overflow = 'auto'
        }

        if(data.count + 1 === 1) {
            document.body.style.overflow = 'hidden'
            const wind = document.body.scrollHeight
            window.scrollTo(0, wind)
            document.querySelector('.messages').style.bottom = '20%'
        }
    });
}

  window.addEventListener('load', load)