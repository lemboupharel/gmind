const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", event => event.preventDefault());
signupForm.addEventListener("submit", event => event.preventDefault());



let token = localStorage.getItem('token') || sessionStorage.getItem('token');
const apiBase = window.location.href;

const getIn = ["signup", "login"];
const endpoint = ["register", "login"];



async function In(val) {
    
    const Username = document.getElementById(`${getIn[val]}Username`).value;
    const Password = document.getElementById(`${getIn[val]}Password`).value;
    const Check = document.getElementById(`${getIn[val]}Check`).checked;

    if(!Username || !Password) {return}

    try{
        const request = await fetch(apiBase + `auth/${endpoint[val]}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: Username, password: Password })
        });

        if(request.ok){
            const response = await request.json();
            token = response.token;
            if(Check){
                localStorage.setItem("token", response.token);
                sessionStorage.removeItem("token");
            }else{
                sessionStorage.setItem("token", response.token);
                localStorage.removeItem("token");
            }

            await dashboard();
            // ask chat page
        }
        else{
            throw new Error("un able to reach server");
        }
    }
    catch(err){
        console.log(err);
        window.alert(err.message);
    }
        
}

async function dashboard() {
    try{
        const request = await fetch(`${apiBase}chat/dash`, {
            headers: { 'Authorization': token }
        });

        if(request.ok){
            const response = await request.text();
            document.body.innerHTML = response;
            console.log(response);
        }
        else{
            throw new Error("faild");
        }
    }
    catch(err){
        console.error(err);
    }
}

if(token){
    async function run() {
        await dashboard();
    }
    run();
}