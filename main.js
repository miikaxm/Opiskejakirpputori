// Formit
const loginForm = document.getElementById("loginForm")
const regForm = document.getElementById("registerForm")
const createOfferForm = document.getElementById("createOffer")
let loggedInUser = ""

// Eventlistenerit kirjautumiselle ja rekisteröitymiselle
document.getElementById("registerForm").addEventListener("submit", register)
document.getElementById("loginForm").addEventListener("submit", logIn)
document.getElementById("createOffer").addEventListener("submit", createOffer)

// Formien avaukset
document.getElementById("OpenLogIn").addEventListener("click", () => {
    if (loggedInUser === "") {
        loginForm.style.display = "block"
    } else {
        loggedInUser = ""
        updateState()
        paivitaLista()
    }
});

document.getElementById("openReg").addEventListener("click", () => {
    loginForm.style.display = "none"
    regForm.style.display = "block"
})

document.getElementById("createSellOffer").addEventListener("click", () => {createOfferForm.style.display = "block"})

// Formien sulkemiset
document.getElementById("closeLogIn").addEventListener("click", () => {loginForm.style.display = "none"})
document.getElementById("closeReg").addEventListener("click", () => {regForm.style.display ="none"})
document.getElementById("closeCreate").addEventListener("click", () => {createOfferForm.style.display = "none"})

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

function getOffers() {
    return JSON.parse(localStorage.getItem("ilmoitukset")) || [];
}

function saveOffers (offers) {
    return localStorage.setItem("ilmoitukset", JSON.stringify(offers))
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
        paivitaLista()
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
        document.getElementById("createSellOffer").style.display = "block"
    } else {
        document.getElementById("OpenLogIn").innerHTML = "Kirjaudu sisään"
        document.getElementById("createSellOffer").style.display = "none"
    }
}

function createOffer(event) {
    event.preventDefault()
    const otsikko = document.getElementById("title").value
    const creator = document.getElementById("loggedUsername").innerHTML
    const hinta = document.getElementById("price").value
    const photoInput = document.getElementById("photo")
    const file = photoInput.files[0]
    
    if (!file) {
        alert("Valitse kuva")
        return
    }

    const reader = new FileReader()
    
    reader.onload = function(e) {
        const kuva = e.target.result
        const ilmoitukset = getOffers()
        const id = ilmoitukset.length + 1

        const newOffer = {
            otsikko,
            hinta,
            kuva,
            id,
            creator
        }

        ilmoitukset.push(newOffer)
        saveOffers(ilmoitukset)
        createOfferForm.style.display = "none"
        document.getElementById("title").value = ""
        document.getElementById("price").value = ""
        photoInput.value = ""
        paivitaLista()
    }

    reader.readAsDataURL(file)
}

// Ilmoituslistan päivitys sivulle
function paivitaLista() {
    const ilmoitukset = getOffers()
    const lista = document.getElementById("ilmoitusLista");
    if (!lista) return; // Jos ilmoituslistaa ei ole

    lista.innerHTML = "";

    if (ilmoitukset.length === 0) {
        lista.innerHTML = `<p class="emptyMessage">Ei ilmoituksia vielä.</p>`;
        return;
    }

    ilmoitukset.forEach(item => {
        if (item.creator === loggedInUser) {
            lista.innerHTML += `
            <div class="card">
                <button class="removeBtn" onclick="poistaIlmoitus(${item.id})">×</button>
                <img src="${item.kuva}" alt="${item.otsikko}">
                <h2 class="card-title">${item.otsikko}</h2>
                <h3>Hinta: <strong>${item.hinta} €</strong></h3>
            </div>
        `;
        } else {
            lista.innerHTML += `
            <div class="card">
                <img src="${item.kuva}" alt="${item.otsikko}">
                <h2 class="card-title">${item.otsikko}</h2>
                <h3>Hinta: <strong>${item.hinta} €</strong></h3>
            </div>
        `;
        }
    });
}

// Poistaa ilmoituksen ID:n perusteella
function poistaIlmoitus(id) {
    let ilmoitukset = getOffers()
    ilmoitukset = ilmoitukset.filter(item => item.id !== id);
    localStorage.setItem("ilmoitukset", JSON.stringify(ilmoitukset));
    paivitaLista();
}

// Listan päivitys
paivitaLista();
