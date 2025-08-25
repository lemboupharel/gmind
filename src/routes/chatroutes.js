import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import prisma from '../prismaClient.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
    router.get('/dash', (req, res) => {
        res.sendFile(path.join(__dirname, './../../views', 'chat.html'));
    });

    router.post('/', async (req, res) => {
        const { userMessage } = req.body;
        try{
            const request = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.apiKey, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    contents: [
                                        {
                                            parts: [
                                                { text: `${userMessage}` }
                                            ]
                                        }
                                    ]
                                })
                            })
            
            if(request.ok){
                const response = await request.json();
                let AiMassage = response.candidates[0].content.parts[0].text; // ajust this to your needs

                const insert = await prisma.message.create({
                    data: {
                        user_m: userMessage,
                        ai_m: AiMassage,
                        user_id: req.userId
                    }
                });
                res.json({insert});
            }
            else{
                throw new Error("request could not reach googleserver");
            }

        }
        catch(err){
            console.log(err.message);
            res.sendStatus(503);
        }

    });


    router.get('/', async (req, res) => {
        const chats = await prisma.message.findMany({
            where: {
                user_id: req.userId
            }
        });
        res.json(chats);
    });



export default router