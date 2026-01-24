import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../config/helper.js";

export async function login(req, res){
    const {uname, pass} = req.body;
    const currUser = await User.findOne({username: uname})
    if(currUser){
        try{
            if (await bcrypt.compare(pass, currUser.password)){
                // this here we need to make sure we are only storing important things into hash.
                const accessToken = generateAccessToken(currUser);
                const refreshToken = generateRefreshToken(currUser);
                // add username and role as well
                const newRefreshToken = new Token({userID: currUser._id, tokenHash: refreshToken})
                newRefreshToken.save().then(()=>{
                    const userData = {
                        "userID": currUser._id,
                        "accessToken": accessToken,
                        "refreshToken": refreshToken
                    }
                    res.status(200).json({
                        "message": "Login Successful",
                        "user": userData
                    })
                })
            }else{
                res.status(401).json({"message": "Password Incorrect."})
            }
        }catch(err){
            res.status(500).json({"message": err})
        }
    }else{
        res.status(500).json({"message": "No such user exists."})
    }
}


export async function logout(req, res){
    try {
        const currUserId = req.body;
        await Token.deleteMany({userID: currUserId}).then(()=>{
            res.status(200).json({"message": "Logout Successful"})
        })
    } catch(err){
        res.status(500).json({"message": err})
    }

}