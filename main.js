// Formit
const loginForm = document.getElementById("loginForm")
const regForm = document.getElementById("registerForm")

// Formien avaukset
document.getElementById("OpenLogIn").addEventListener("click", () => {loginForm.style.display = "block"});

document.getElementById("openReg").addEventListener("click", () => {
    loginForm.style.display = "none"
    regForm.style.display = "block"
})

// Formien sulkemiset
document.getElementById("closeLogIn").addEventListener("click", () => {loginForm.style.display = "none"})
document.getElementById("closeReg").addEventListener("click", () => {regForm.style.display ="none"})

// Kirjautumis formin avaus rekisteröitymisestä
document.getElementById("LoginToReg").addEventListener("click", () => {
    regForm.style.display = "none"
    loginForm.style.display = "block"
})