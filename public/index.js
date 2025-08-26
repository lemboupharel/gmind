
const prompt = document.getElementById("prompt");
const sendBTN = document.getElementById("sendBTN");
const discution = document.getElementById("discution");

let UserMassage;
let AiMassage = [];

function srcole(){
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function pushUserMessage(message){
    if(message === "") {return}
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

async function getAllChats() {
    try{
        const request = await fetch(apiBase + 'chat', {
            headers: { 'Authorization': token }
        });
        if(request.ok){
            const response = await request.json();
            response.forEach( message => {
                pushUserMessage(message.user_m);
                pushAIMessage(message.ai_m)
            });
        }
        else{
            throw new Error("can't reach resource");
        }

    }catch(err){
        console.log(err);
    }
}

async function chat() {
    chatinput = prompt.value;
    sendBTN.classList.add("button-unclickable");
    pushUserMessage(chatinput);
    prompt.value = "";
    try{
        const request = await fetch(apiBase + 'chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ chatinput })
            });

        if(request.ok){
            const response = await request.json();
            pushAIMessage(response.insert.ai_m);
            sendBTN.classList.remove("button-unclickable");
        }



    }catch(err){
        console.error(err);
        window.alert(`And error occured: ${err.message}`);
    }
}

getAllChats();

