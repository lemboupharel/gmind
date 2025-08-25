import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import authroutes from './routes/authroutes.js'
import chatroutes from './routes/chatroutes.js'
import authmiddleware from './middleware/authmiddleware.js'


const serverApp = express();
const PORT = process.env.PORT || 5000  // port number here

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middle ware
    // serving static files
    serverApp.use(express.static(path.join(__dirname, './../public')));

    // accept Json data
    serverApp.use(express.json());

// routes end points
    serverApp.use('/auth', authroutes);
    serverApp.use('/chat', authmiddleware, chatroutes);


serverApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../views', 'login.html'));
});




serverApp.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})