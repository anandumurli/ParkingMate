// get all users
// create new user
// update user password
// update role based passwords
// delete user based on username
// get one user (id)
import express from "express";
import { activateUserbyID, createNewUser, deleteUserByID, getAllUsers, updateUserPassword,
         getUserByID,  updateUserDetailsByID } from "../controllers/userController.js";
import { authenticateToken } from "../config/helper.js";
const router = express.Router();

router.get("/allUsers", authenticateToken,getAllUsers);
router.post("/newUser", authenticateToken, createNewUser);
router.put("/updatePassword", authenticateToken, updateUserPassword);
router.put("/updateUser/:id", authenticateToken, updateUserDetailsByID); //_id: userID, formData: updatedFormData
router.delete("/deleteUser/:id", authenticateToken, deleteUserByID);
router.get("/getOneUser/:id", authenticateToken, getUserByID);
router.put("/activateUser/:id", authenticateToken, activateUserbyID);


export default router;