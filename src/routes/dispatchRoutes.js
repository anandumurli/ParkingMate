//set values individual, hence all these routes.
//date
//numberOfWaves
//numberOfParcels
//numberOfParcelsMissing

import express from "express";
import { authenticateToken  } from "../config/helper.js";
import { setNumberOfParcels, setNumberOfParcelsMissing, 
    setNumberOfWaves, getNumberOfWavesToday } from "../controllers/dispatchController.js";
const router = express.Router();

router.post("/setNWaves", authenticateToken, setNumberOfWaves);
router.post("/setNParcels", authenticateToken, setNumberOfParcels);
router.post("/setNMissingParcels", authenticateToken, setNumberOfParcelsMissing);
router.get("/getNWaves", authenticateToken, getNumberOfWavesToday);

export default router;