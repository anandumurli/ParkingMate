// export everything here, 
// jwt signing keys
// jwt verify keys
// jwt generate refresh keys.
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendstatus(401)
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,(err, user)=>{
        if (err) return res.status(500).json({"message":err})
        req.user = user
        next()
    })
}

export function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'})
}

export function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}
