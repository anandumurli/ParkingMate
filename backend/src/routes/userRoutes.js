// get all users
// create new user
// update user password
// update role based passwords
// delete user based on username
// get one user (id)
import express from "express";
import { createNewUser, deleteUser, getAllUsers, 
         getUserByID, updateRoleBasedPassword, 
         updateUserPassword } from "../controllers/userController.js";
const router = express.Router();

router.get("/allUsers", getAllUsers);
router.post("/newUser", createNewUser);
router.put("/updatePassword", updateUserPassword);
router.put("/updateRolePassword", updateRoleBasedPassword);
router.delete("/deleteUser", deleteUser);
router.get("/getOneUser/:id",getUserByID);


export default router;