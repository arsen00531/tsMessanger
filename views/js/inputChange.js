window.addEventListener('load', () => {
    const forms = document.querySelectorAll('form')
    const error = document.querySelector('.error_main')

    forms.forEach(form => form.addEventListener('submit', (e) => {
            const inputs = document.querySelectorAll(`.${e.target.children[0].className} input`)
            
            inputs.forEach(input => {
                if (input.value === '' || input.value === ' ') {
                    e.preventDefault()
                    error.style.display = 'block'
                    error.textContent = 'Вы не ввели имя или пароль'
                }
            })
        })
    )
})