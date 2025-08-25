import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router();

    router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 12); // here the salt is 12

        try{
            const user = await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword
                }
            });

            const defaultChat = "Hi I'm G-mind a LLM trained by google";

            await prisma.message.create({
                data: {
                    user_m : "",
                    ai_m: defaultChat,
                    user_id: user.id
                }
            });

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
            res.json({token});

        }

        catch(err){
            res.sendStatus(503);
            console.log(`could not register ${username}`);
        }
    });


    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try{
            const user = await prisma.user.findUnique({
                where: {
                    "username": username 
                }
            });

            if(user){
                const passwordIsValid = bcrypt.compareSync(password, user.password);
                if (passwordIsValid){
                    console.log(`${user.username} logged in`);
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
                    res.json({token});
                }
                else{
                    console.log(`Invalid pasword for user ${username}`);
                    return res.status(404).send({message: `Invalid pasword for user ${username}`});
                }
            }

            else{
                console.log(`Invalid user name`);
                return res.status(404).send({message: "Invalid user name"});
            }
        }

        catch(err){
            console.log(err.message);
            res.sendStatus(503);
        }
    });

export default router