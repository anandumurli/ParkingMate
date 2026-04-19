import bcrypt from "bcrypt";
import User from "../models/userModel.js";
// get all users
// making all 500 responses to 200, because axios is stoopid
export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({"users" : users});
    }catch(err){
        console.log("err", err)
        res.status(500).json({"message": err});
    }
} 

// create new user
export async function createNewUser(req, res) {
    try {
        const {role, pass, uname} = req.body; //destructuring would expect similar data to be sent inside as well
        const hashedPassword = (pass) && await bcrypt.hash(pass, 10);
        const currUser = {role : role, password: hashedPassword, username: uname}
        console.log(currUser)
        const newUser = new User(currUser);
        newUser.save().then(()=>{
            res.status(200).json({"message": "User created Successfully"})
        })
    }catch(err){
        console.log("err", err)

        res.status(200).json({"message": err})
    }
}


// update user password - will add bcrypt later
export async function updateUserPassword(req, res) {
    try {
        const {newPassword, userName} = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.updateOne({username: userName},{password: hashedPassword}).then(()=>{
            res.status(200).json({"message": "Password Updated Successfully."})
        })

    } catch(err){
        res.status(200).json({"message": err})
    }
}

// update role based passwords - will add bcrypt
export async function updateRoleBasedPassword(req, res) {
    try {
        const {currRole, newPassword} = req.body
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.updateMany({role: currRole}, {password: hashedPassword}).then(() => {
            res.status(200).json({"message": `Passwords for all ${currRole}/s have been updated`})
        })
    }catch(err){
        res.status(200).json({"message": err})
    }
}

// delete user based on username
export async function deleteUser(req, res) {
    try {
        const currUser = req.body
        await User.findOneAndDelete({username: currUser}).then(()=>{
            res.status(200).json({"message": "User has been deleted."})
        })
    }catch(err){
        res.status(200).json({"message": err})
    }
}

// get one user (id)
export async function getUserByID(req,res) {
    try {
        const userId = req.params.id
        await User.findById(userId).then((user) => {
            res.status(200).json({"user": user})
        })
    } catch(err){
        res.status(200).json({"message": err})
    }
}