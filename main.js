// Formit
const loginForm = document.getElementById("loginForm")
const regForm = document.getElementById("registerForm")
const createOfferForm = document.getElementById("createOffer")
const sendMessage = document.getElementById("sendMessage")
let loggedInUser = ""

// Eventlistenerit kirjautumiselle ja rekisteröitymiselle
document.getElementById("registerForm").addEventListener("submit", register)
document.getElementById("loginForm").addEventListener("submit", logIn)
document.getElementById("createOffer").addEventListener("submit", createOffer)

// Viestin lähetys
document.getElementById("sendMessage").addEventListener("submit", sendNewMessage)

// Formien avaukset
document.getElementById("OpenLogIn").addEventListener("click", () => {
    if (loggedInUser === "") {
        loginForm.style.display = "block"
        document.querySelector(".overlay").style.display = "block";
    } else {
        loggedInUser = ""
        updateState()
        paivitaLista()
    }
});

document.getElementById("openReg").addEventListener("click", () => {
    loginForm.style.display = "none"
    regForm.style.display = "block"
    document.querySelector(".overlay").style.display = "block";
})

document.getElementById("openMessages").addEventListener("click", () => {
    Messages.style.display = "block"
    document.querySelector(".overlay").style.display = "block";
    paivitaViestit()
})

document.getElementById("openSendMessage").addEventListener("click", () => {
    sendMessage.style.display = "block"
    Messages.style.display = "none"
    document.querySelector(".overlay").style.display = "block";
})

document.getElementById("createSellOffer").addEventListener("click", () => {
    createOfferForm.style.display = "block"
    document.querySelector(".overlay").style.display = "block";
})

// Formien sulkemiset
function closeForm(formId, overlaySelector = ".overlay") {
    const form = document.getElementById(formId)
    if (form) form.style.display = "none"
    const overlay = document.querySelector(overlaySelector)
    if (overlay) overlay.style.display = "none"
}

// Close form event listeners
document.getElementById("closeLogIn").addEventListener("click", () => closeForm("loginForm"))
document.getElementById("closeReg").addEventListener("click", () => closeForm("registerForm"))
document.getElementById("closeCreate").addEventListener("click", () => closeForm("createOffer"))
document.getElementById("closeMessages").addEventListener("click", () => closeForm("Messages"))
document.getElementById("closeSendMessage").addEventListener("click", () => closeForm("sendMessage"))


// Kirjautumis formin avaus rekisteröitymisestä
document.getElementById("LoginToReg").addEventListener("click", () => {
    regForm.style.display = "none"
    loginForm.style.display = "block"
})

// Localstorage
function getUsers() {return JSON.parse(localStorage.getItem("users") || "[]")}
function saveUsers(users) {localStorage.setItem("users", JSON.stringify(users))}
function getOffers() {return JSON.parse(localStorage.getItem("ilmoitukset")) || [];}
function saveOffers(offers) {return localStorage.setItem("ilmoitukset", JSON.stringify(offers))}
function getMessages() {return JSON.parse(localStorage.getItem("viestit")) || [];}
function saveMessages(messages) {return localStorage.setItem("viestit", JSON.stringify(messages))}

// Funktio rekisteröitymiselle
function register(event){
    event.preventDefault()
    const username = document.getElementById("regUsername").value.trim()
    const password = document.getElementById("regPassword").value
    const users = getUsers()

    if(users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        document.getElementById("regError").innerText = "Käyttäjänimi on jo käytössä"
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
    document.querySelector(".overlay").style.display = "none";
}

// Funktio kirjautumiselle
function logIn(event){
    event.preventDefault()
    const username = document.getElementById("logUsername").value.trim()
    const password = document.getElementById("LogPassword").value
    const users = getUsers()

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())

    if(!user) {
        document.getElementById("logError").innerText = "Käyttäjänimi tai salasana on väärä"
    }

    if (user.password === password) {
        loggedInUser = username
        updateState()
        loginForm.style.display = "none"
        document.getElementById("LogPassword").value = ""
        document.getElementById("logUsername").value = ""
        document.querySelector(".overlay").style.display = "none";
        paivitaLista()
    } else {
        document.getElementById("logError").innerText = "Käyttäjänimi tai salasana on väärä"
        document.getElementById("LogPassword").value = ""
    }
}

// Kirjautumisen tilan päivittäminen
function updateState() {
    document.getElementById("loggedUsername").innerHTML = loggedInUser
    if (loggedInUser !== "") {
        document.getElementById("OpenLogIn").innerHTML = "Kirjaudu ulos"
        document.getElementById("createSellOffer").style.display = "block"
        document.getElementById("openMessages").style.display = "block"
        document.getElementById("openSendMessage").style.display = "block"
    } else {
        document.getElementById("OpenLogIn").innerHTML = "Kirjaudu sisään"
        document.getElementById("createSellOffer").style.display = "none"
        document.getElementById("openMessages").style.display = "none"
        document.getElementById("openSendMessage").style.display = "none"
    }
}

// Funktio myynti-ilmoituksen luonnille
function createOffer(event) {
    event.preventDefault()
    const otsikko = document.getElementById("title").value
    const creator = document.getElementById("loggedUsername").innerHTML
    const hinta = document.getElementById("price").value
    const photoInput = document.getElementById("photo")
    const file = photoInput.files[0]
    
    if (!file) {
        document.getElementById("createError").innerText = "Kuva on pakollinen ilmoitukseen"
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
        document.querySelector(".overlay").style.display = "none";
        paivitaLista()
    }

    reader.readAsDataURL(file)
}

// Funktio viestin lähetykselle
function sendNewMessage(event) {
    event.preventDefault()
    const vastaanottaja = document.getElementById("toUser").value.toLowerCase()
    const lähettäjä = document.getElementById("loggedUsername").innerHTML.toLowerCase()
    const viesti = document.getElementById("message").value
    const users = getUsers()
    const viestit = getMessages()

    const user = users.find(u => u.username.toLowerCase() === vastaanottaja.toLowerCase())

    if(!user) {
        document.getElementById("sendError").innerText = "Vastaanottajan käyttäjää ei löydy"
        return
    }

    if(vastaanottaja === lähettäjä) {
        document.getElementById("sendError").innerText = "Et voi lähettää itsellesi viestiä"
        document.getElementById("toUser").value = ""
        return
    }

    const NewMessage = {
        vastaanottaja,
        lähettäjä,
        viesti
    }

    viestit.push(NewMessage)
    saveMessages(viestit)
    sendMessage.style.display = "none"
    document.getElementById("toUser").value = ""
    document.getElementById("message").value = ""
    document.querySelector(".overlay").style.display = "none";
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
                <h2 class="card-title">${item.otsikko} | Myyjä: ${item.creator}</h2>
                <h3>Hinta: <strong>${item.hinta} €</strong></h3>
            </div>
        `;
        } else {
            lista.innerHTML += `
            <div class="card">
                <img src="${item.kuva}" alt="${item.otsikko}">
                <h2 class="card-title">${item.otsikko} | Myyjä: ${item.creator}</h2>
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

// Viestien päivitys
function paivitaViestit() {
    const viestit = getMessages()
    const viestiLista = document.getElementById("messageList")
    viestiLista.innerHTML = ""

    if (viestit.length === 0) {
        viestiLista.innerHTML = `<p>Ei viestejä vielä.</p>`;
        return;
    }

    viestit.forEach(viesti => {
        if (viesti.vastaanottaja === loggedInUser.toLowerCase()) {
            viestiLista.innerHTML += `
            <div>
                <p><strong>${viesti.lähettäjä}:</strong> ${viesti.viesti}</p>
            </div>
            `
        }
    })
}


// Esimerkki käyttöön localstorageen lisäykset
function addExample() {
    let users = getUsers()
    let offers = getOffers()

    if(users.length === 0) {
        testUser = {
        username: "test",
        password: "test"
    }

    testOffer1 = {
        otsikko: "Vaatteita",
        hinta: "10",
        kuva: "img/junko-nakase-Q-72wa9-7Dg-unsplash.jpg",
        id: 1,
        creator: "test"
    }
    testOffer2 = {
        otsikko: "Huonekaluja",
        hinta: "50",
        kuva: "img/ansuman-mishra-5kza-6yGHnk-unsplash.jpg",
        id: 2,
        creator: "test"
    }
    testOffer3 = {
        otsikko: "Kello",
        hinta: "70",
        kuva: "img/john-torcasio-TJrkkhdB39E-unsplash.jpg",
        id: 3,
        creator: "test"
    }

    users.push(testUser)
    offers.push(testOffer1)
    offers.push(testOffer2)
    offers.push(testOffer3)
    saveUsers(users)
    saveOffers(offers)
    }
}

addExample()
