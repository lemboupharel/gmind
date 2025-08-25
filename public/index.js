let token = localStorage.getItem('token') || sessionStorage.getItem('token');

const signPage = document.getElementById("signPage")
const chat = document.getElementById("chat");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", event => event.preventDefault());
signupForm.addEventListener("submit", event => event.preventDefault());
const apiBase = window.location.href;


const sendBTN = document.getElementById("sendBTN");
const discution = document.getElementById("discution");


function showchatboard(){
    signPage.style.display = "none";
    chat.style.display = "block";
}

function srcole(){
    //window.scrollTo({
    //    top: document.body.scrollHeight,
    //    behavior: 'smooth'
    //});
    console.log("hi");
}

function pushUserMessage(message){
    if (message===""){return}
    const row = document.createElement("div");
    row.className = "row d-flex justify-content-end my-1";
    row.innerHTML = `<div class="col-12 col-sm-10 col-md-9">
                        <div class="card border-secondary text-secondary">
                            <div class="card-header">You</div>
                            <div class="card-body">
                                <pre class="card-text"></pre>
                            </div>
                        </div>
                    </div>`;
    row.querySelector("pre").textContent = `${message}`;
    discution.append(row);
    srcole();
}

function pushAIMessage(message){
    const htmlOutput = marked.parse(message);
    const row = document.createElement("div");
    row.className = "row d-flex justify-content-start my-1";
    row.innerHTML = `<div class="col-12 col-sm-10 col-md-9">
                        <div class="card border-secondary text-secondary">
                            <div class="card-header">AI</div>
                            <div class="card-body">
                                <p class="card-text">${htmlOutput}</p>
                            </div>
                        </div>
                    </div>`;
    discution.append(row);
    srcole();
}



async function login(){
    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;
    const loginCheck = document.getElementById("loginCheck").checked;
    if(!loginUsername || !loginPassword){return} // i'll check username and password here later on
    
    try{
        const request = await fetch(apiBase + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        })

        if(request.ok){
            const response = await request.json();

            //saving token
            token = response.token;
            if(loginCheck){
                localStorage.setItem("token", response.token);
                sessionStorage.removeItem("token");
            }
            else{
                sessionStorage.setItem("token", response.token);
                localStorage.removeItem("token");
            }

            await getAllChatsHistory();
            showchatboard();
            
            
            //console.log(response);
        }else{
            throw new Error("unable to reach resource");
        }

    }catch(error){
        console.error(error);
    }
}


async function signup(){
    const signupUsername = document.getElementById("signupUsername").value;
    const signupPassword = document.getElementById("signupPassword").value;
    const signupCheck = document.getElementById("signupCheck").checked;
    if(!signupUsername || !signupPassword) {return} // i'll check username and password here later on
    
    try{
        const request = await fetch(apiBase + 'auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: signupUsername, password: signupPassword})
        });
       

        if(request.ok){
            const response = await request.json();

            //saving token
            token = response.token;
            if(signupCheck){
                localStorage.setItem("token", response.token);
                sessionStorage.removeItem("token");
            }
            else{
                sessionStorage.setItem("token", response.token);
                localStorage.removeItem("token");
            }

            await getAllChatsHistory();
            showchatboard();
            
            //console.log(response);
        }
        else{
            throw new Error("unable to reach resource");
        }

    }catch(error){
        console.error(error);
    }

}

async function getAllChatsHistory() {
    try{
        const request = await fetch(apiBase + 'chats', {
            headers: { 'Authorization': token }
        });
        if(request.ok){
            const response = await request.json();
            response.chat.forEach(element => {
                element.user_message? pushUserMessage(element.user_message) : "";
                pushAIMessage(element.ai_message);
            });

        }
        else if(request.status === 401){
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            signPage.style.display = "block";
            chat.style.display = "none";
        }
        else {
            throw new Error("can not reach resource")
        }
    } catch(error){
        console.error(error);
    }

}

async function postchat() {
    const prompt = document.getElementById("prompt");
    const chatinput = prompt.value;
    pushUserMessage(chatinput);
    if(!chatinput){return}
        try{
            const request = await fetch(apiBase + 'chats', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            },
                            body: JSON.stringify({ chatinput })
                        });
            
            if(request.ok){
                const response = await request.json();

                pushAIMessage(response.ai_message);

                console.log(response);
                //window.alert(user);
                //window.alert(ai);
            }
            else{
                throw new Error("mouf");
            }

        } catch(err){
            console.error(err);
        }
        
    prompt.value = '';
    //getAllChatsHistory();
}


// if authenticated show chats
if(token) {
    async function run() {
        try{
            await getAllChatsHistory();
            showchatboard();

        }catch(error){
            console.error(error);
        }
    }
    run();
}
