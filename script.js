const inputField  = document.querySelector(".input")
const sendBtn = document.querySelector(".send-btn")

const inputLogin = document.querySelector(".name")
const loginError = document.querySelector(".empty-error")
const loginBtn = document.querySelector(".join")

//areák
const loginArea  = document.querySelector(".login-area")
const textArea  = document.querySelector(".text-area")
const inputArea  = document.querySelector(".input-area")

let ourName = ""

/* bejelentkezés rész */

loginBtn.addEventListener("click", ()=> {
    ourName = inputLogin.value
    if (ourName === "") { inputLogin.focus(); loginError.style.opacity = "1"; return }
    //ha succesful connect a szerverhez
    loginError.style.opacity = "1"
    loginError.style.color = "#fff"
    loginError.innerText = "Connecting please wait..."

    //ha secure serverre connectelünk akk wss:// protokollal kell connectelni
    //ws = new WebSocket("ws://localhost:5000") // <- teszt only
    ws = new WebSocket("wss://strife-test2.glitch.me/:5000")

    ws.addEventListener('open', () => {
        // transition a chat appba
        loginArea.style.display = "none";
        textArea.style.display = "flex";
        inputArea.style.display = "flex";
    })

    ws.addEventListener('message',function(event) {
        otherMessage(event.data)
    })
    ws.addEventListener('error',function(err){
        loginError.style.opacity = "1"
        loginError.style.color = "crimson"
        loginError.innerText = "Can't connect to the server :("
    })
})
// enterrel való aktiválás
inputLogin.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      /*event.preventDefault();*/
      loginBtn.click();
    }
})



/* ez már a chat rész */

sendBtn.addEventListener("click", ()=> {
    let sendMsg = inputField.value
    if (sendMsg === "") {inputField.focus(); return }
    inputField.value = ""
    inputField.focus()
    let bubble = document.createElement("div")
    bubble.classList.add("message","right")
    bubble.innerText = sendMsg
    textArea.append(bubble)
    textArea.scrollTop = textArea.scrollHeight;

    ws.send(String(ourName+","+sendMsg))
})

inputField.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      /*event.preventDefault();*/
      sendBtn.click();
    }
})

function otherMessage(arg) {

    let msg = parse(arg)[1]
    let msgName = parse(arg)[0]

    let name = document.createElement("strong")
    name.innerText = msgName

    let text = document.createElement("p")
    text.innerText = msg

    let bubble = document.createElement("div")
    bubble.classList.add("message","left")
    bubble.append(name)
    if(msg !== undefined ) { bubble.append(text) }
    textArea.append(bubble)

    if ( msg.includes("@"+ourName) || msg.includes("@everyone") ) {
        bubble.style.background = "orange"
    }

    textArea.scrollTop = textArea.scrollHeight;
}

function parse(arg) {
    return arg.split(",")
}


//#acff2f