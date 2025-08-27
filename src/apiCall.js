import { text } from "body-parser";
import prisma from "./prismaClient.js"

const apikey = process.env.API_KEY.replaceAll('"','');


async function apiCall(chatinput, uid) {
    let conversation = []; // conversation history

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
