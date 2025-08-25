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


export default router