// Formit
const loginForm = document.getElementById("loginForm")
const regForm = document.getElementById("registerForm")
let loggedInUser = ""

// Eventlistenerit kirjautumiselle ja rekisteröitymiselle
document.getElementById("registerForm").addEventListener("submit", register)
document.getElementById("loginForm").addEventListener("submit", logIn)

// Formien avaukset
document.getElementById("OpenLogIn").addEventListener("click", () => {
    if (loggedInUser === "") {
        loginForm.style.display = "block"
    } else {
        loggedInUser = ""
        updateState()
    }
});

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

function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]")
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users))
}

function register(event){
    event.preventDefault()
    const username = document.getElementById("regUsername").value.trim()
    const password = document.getElementById("regPassword").value
    const users = getUsers()

    if(users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        // Tähän parempi ilmoitus myöhemmin
        alert("käyttähä on jo olemassa")
        return
    }

    const newU= {
        username,
        password
    }

    users.push(newU)
    saveUsers(users)
    regForm.style.display = "none"
    document.getElementById("regUsername").value = ""
    document.getElementById("regPassword").value = ""
}

function logIn(event){
    event.preventDefault()
    const username = document.getElementById("logUsername").value.trim()
    const password = document.getElementById("LogPassword").value
    const users = getUsers()

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())

    if(!user) {
        // Tähänkin parempi ilmoitus myöhemmin
        alert("Ei löydy käyttäjää tällä nimellä")
    }

    if (user.password === password) {
        loggedInUser = username
        updateState()
        loginForm.style.display = "none"
        document.getElementById("LogPassword").value = ""
        document.getElementById("logUsername").value = ""
    } else {
        // Tähänkin parempi ilmoitus myöhemmin
        alert("Väärä salasana")
        document.getElementById("LogPassword").value = ""
    }
}

function updateState() {
    document.getElementById("loggedUsername").innerHTML = loggedInUser
    if (loggedInUser !== "") {
        document.getElementById("OpenLogIn").innerHTML = "Kirjaudu ulos"
    } else {
        document.getElementById("OpenLogIn").innerHTML = "Kirjaudu sisään"
    }
}


// Haetaan ilmoitukset localStoragesta
let ilmoitukset = JSON.parse(localStorage.getItem("ilmoitukset")) || [];

// Ilmoituslistan päivitys sivulle
function paivitaLista() {
    const lista = document.getElementById("ilmoitusLista");
    if (!lista) return; // Jos ilmoituslistaa ei ole

    lista.innerHTML = "";

    if (ilmoitukset.length === 0) {
        lista.innerHTML = `<p class="emptyMessage">Ei ilmoituksia vielä.</p>`;
        return;
    }

    ilmoitukset.forEach(item => {
        lista.innerHTML += `
            <div class="card">
                <button class="removeBtn" onclick="poistaIlmoitus(${item.id})">×</button>
                <img src="${item.kuva}" alt="${item.otsikko}">
                <h3 class="card-title">${item.otsikko}</h3>
                <p>Hinta: <strong>${item.hinta} €</strong></p>
            </div>
        `;
    });
}

// Poistaa ilmoituksen ID:n perusteella
function poistaIlmoitus(id) {
    ilmoitukset = ilmoitukset.filter(item => item.id !== id);
    localStorage.setItem("ilmoitukset", JSON.stringify(ilmoitukset));
    paivitaLista();
}

// Listan päivitys
paivitaLista();
