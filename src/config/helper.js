// export everything here, 
// jwt signing keys
// jwt verify keys
// jwt generate refresh keys.
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({"error": "No Token Found"})
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
        if (err) return res.status(500).json({"message":err})
        req.user = user
        next()
    })
}

export function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}



//we are not authenticating tokens while sending out api calls. 
//there is no regeneration happening,
// we need to work with refreshTokens , not working with it as of now! 
// need to understand the logic bettter.