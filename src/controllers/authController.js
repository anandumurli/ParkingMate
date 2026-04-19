import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../config/helper.js";

// can not send the response mongoose directly to jwt token generator, 
// need to fix this in boilerplate


export async function login(req, res){
    const {uname, pass} = req.body;
    const currUser = await User.findOne({username: uname})
    if(currUser){
        try{

            if (await bcrypt.compare(pass, currUser.password)){
                const tokenData = {"role": currUser.role, "uname": currUser.uname, "id": currUser._id}
                const accessToken = generateAccessToken(tokenData);
                const refreshToken = generateRefreshToken(tokenData);
                const userData = {userID: currUser._id, tokenHash: refreshToken}
                const newRefreshToken = new Token(userData)
                newRefreshToken.save().then(()=>{
                    const userData = {
                        "userID": currUser._id,
                        "accessToken": accessToken,
                        "refreshToken": refreshToken,
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
        res.status(200).json({"message": "No such user exists."})
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