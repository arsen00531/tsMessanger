const load = () => {
    const back = document.querySelector('.back')
    const nextBack = document.querySelector('.next_back')
    const error = document.querySelector('.error') || undefined
    const button = document.querySelector('button')

    const toBlock = (clickEvent) => {
        clickEvent.preventDefault()
        back.style.display = 'block'
        nextBack.style.display = 'block'

        if (error) error.style.display = 'block'

        document.addEventListener('click', (e) => {
            if(e.target === back) {
                back.style.display = 'none'
                nextBack.style.display = 'none'
                if (error) error.style.display = 'block'
            }
        })
    }
    
    document.querySelector('.image a').addEventListener('click', toBlock)
    document.querySelector('.user_img').addEventListener('click', toBlock)

    document.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.code === 'Enter' && back.style.display === 'block') {
            button.click()
        }
    })
}

window.addEventListener('load', load)