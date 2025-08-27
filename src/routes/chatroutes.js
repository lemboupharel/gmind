import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import apiCall from '../apiCall.js'
import prisma from '../prismaClient.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
    router.get('/dash', (req, res) => {
        res.sendFile(path.join(__dirname, './../../views', 'chat.html'));
    });

    router.post('/', async (req, res) => {
        const { chatinput } = req.body;
        try{
            const response = await apiCall(chatinput);

            let AiMassage = response.candidates[0].content.parts[0].text; // ajust this to your needs

            const insert = await prisma.message.create({
                data: {
                    user_m: chatinput,
                    ai_m: AiMassage,
                    user_id: req.userId
                }
            });
            res.json({insert});
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