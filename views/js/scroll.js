const loaded = () => {
    const count = document.querySelectorAll('.user_mess').length

    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'instant'
        })
    }, 1)

    if(count < 11) {
        document.body.style.overflow = 'hidden'
        window.scrollTo(0, document.body.scrollHeight)
    }

    else if (count === 1) {
        document.body.style.overflow = 'hidden'
        window.scrollTo(0, document.body.scrollHeight)
    
        const massages = document.querySelector('.messages')
        massages.style.bottom = '20%'
    }
    
    else {
        window.scrollTo(0, document.body.scrollHeight)
        const massager = document.querySelector('.messages')
        massager.style.bottom = '85%'
        document.body.style.overflow = 'auto'
    }
    
    document.addEventListener('resize', () => window.scrollTo(0 , document.body.scrollHeight))
}

window.addEventListener('load', loaded)