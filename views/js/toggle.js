document.querySelector('.account_not_log').addEventListener("click", (e) => {
    e.preventDefault()
    const regLog = document.querySelector('.reg_and_log')

    if (regLog.classList.length === 2) regLog.classList.remove('clicked')
    else regLog.classList.add('clicked')
})