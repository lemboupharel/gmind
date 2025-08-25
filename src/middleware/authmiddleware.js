import jwt from 'jsonwebtoken'

function authmiddleware (req, res, next){
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json({message: "invalid authorisation with invalid token"});
            }
            req.userId = decoded.id;
            next();
        });
    }
    else{
        res.status(401).json({message: "unauthorised device with no token"});
    }
}

export default authmiddleware