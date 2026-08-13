import bcrypt from "bcrypt";
import User from "../models/userModel.js";
// get all users
// making all 500 responses to 200, because axios is stoopid
// have added permissions, however not using permissions atm.
// isActive is a function we have, need to implemet the useage, will do later.

export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({"users" : users});
    }catch(err){
        console.log("err", err)
        res.status(200).json({"message": err});
    }
} 

// create new user
export async function createNewUser(req, res) {
    try {
        const {role, pass, uname, isActive} = req.body; //destructuring would expect similar data to be sent inside as well
        const hashedPassword = (pass) && await bcrypt.hash(pass, 10);
        const currUser = {role : role, password: hashedPassword, username: uname, isActive: isActive}
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



// delete user based on username
export async function deleteUserByID(req, res) {
    try {
        const userId = req.params.id
        await User.findByIdAndDelete(userId).then(()=>{
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


// activate user based by id
export async function activateUserbyID(req,res) {
    try {
        const userId = req.params.id
        await User.findByIdAndUpdate(userId, {idActive: true}).then(() => {
            res.status(200).json({"message": "User has been activated."})
        })
    } catch(err){
        res.status(200).json({"message": err})
    }
}

export async function updateUserDetailsByID(req, res) {
    try{
        const userId = req.params.id
        const {role, password, isActive, permissions} = req.body;
        const hashedPassword = (password) && await bcrypt.hash(password, 10);
        const currUserEdit = {role : role, password: hashedPassword,  isActive: isActive, permissions: permissions }
        await User.findByIdAndUpdate(userId, currUserEdit).then(()=>{
            res.status(200).json({"message": "User Details have been updated. Request to login again."})
        })
    }catch(err){
        res.status(200).json({"message": err})
    }
}