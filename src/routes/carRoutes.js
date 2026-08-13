import express from "express"
import { authenticateToken } from "../config/helper.js";
import { getAllCarsToday, parkNewCar } from "../controllers/carController.js";

const router = express.Router();

router.get("/cars", authenticateToken, getAllCarsToday);
router.post("/cars", authenticateToken, parkNewCar);


export default router;