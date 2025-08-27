import prisma from "./prismaClient.js"

const apikey = process.env.API_KEY.replaceAll('"','');
const memory = 4;
async function getLatest(uid) {
    const chats = await prisma.message.findMany({
        where: {
            user_id: uid
        }
    });
    return chats;
}


async function apiCall(chatinput, uid) {
    let conversation = []; // conversation history
    let chatArray = await getLatest(uid); //get all chats
    chatArray = chatArray.slice(-memory); // limit memory

    chatArray.forEach((chat) => {
        conversation.push({
            role: "user",
            parts: [{text: `${chat.user_m}`}]
        });

        conversation.push({
            role: "model",
            parts: [{text: `${chat.ai_m}`}]
        });
    });

    conversation.push({
        role: "user",
        parts: [{text: `${chatinput}`}]
    });


    const request = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apikey, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        contents: conversation
                                    })
                                });
        
    if(request.ok){
        const response = await request.json();
        return response;

    }
    else{
        throw new Error("request could not reach googleserver");
    }
}

export default apiCall
