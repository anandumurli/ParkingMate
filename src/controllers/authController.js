import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../config/helper.js";

// Not using the refresh token logic for now, 
// marking the accessToken as never exprirng token



export async function login(req, res){
    const {uname, pass} = req.body;
    const currUser = await User.findOne({username: uname})
    if(currUser && currUser.isActive === true){
        try{
            console.log("rolexx" + currUser.role)
            if (await bcrypt.compare(pass, currUser.password)){
                const tokenData = {"role": currUser.role, "uname": currUser.username, "id": currUser._id}
                const accessToken = generateAccessToken(tokenData);
                const userData = {userID: currUser._id, tokenHash: accessToken}
                const newAccessToken = new Token(userData)
                newAccessToken.save().then(()=>{
                    const userData = {
                        "userID": currUser._id,
                        "accessToken": accessToken,
                        "role": currUser.role
                    }
                    res.status(200).json({
                        "message": "Login Successful",
                        "user": userData
                    })
                })
            }else{
                res.status(200).json({"message": "Password Incorrect."})
            }
        }catch(err){
            console.log("thee errror"+  err)
            res.status(200).json({"m": err})
        }
    }else{
        res.status(200).json({"message": "No such user exists. Please Talk to Admin."})
    }
}


export async function logout(req, res){
    try {
        const currUserId = req.body;
        await Token.deleteMany({userID: currUserId}).then(()=>{
            res.status(200).json({"message": "Logout Successful"})
        })
    } catch(err){
        res.status(200).json({"message": err})
    }

}