// router.post("/setNWaves");
// router.post("/setNParcels");
// router.post("/setNMissingParcels");

import Dispatch from "../models/dispatchModel.js";

//date
//numberOfWaves
//numberOfParcels
//numberOfParcelsMissing

export async function setNumberOfWaves(req, res) {
    try {
        const {date, nWaves} = req.body; //ensure this and the one senidng is same
        let todayDate = new Date(date).setHours(0,0,0,0).toLocaleString()
        const data = {date: new Date(date).setHours(0,0,0,0), numberOfWaves:nWaves}
        await Dispatch.findOneAndUpdate(
            {date: data.date},
            {numberOfWaves: data.numberOfWaves},
            {upsert: true, new: true}
        ).then(() =>{
            res.status(200).json({"message": "Waves have been set."})
        })
    }catch (err){
        res.status(200).json({"message": err})
    }
}


export async function setNumberOfParcels(req, res){
    try{
        const {date, nParcels} = req.body;
        const data = {date: new Date(date).setHours(0,0,0,0), numberOfParcels:nParcels}
        await Dispatch.findOneAndUpdate(
            {date: data.date},
            {numberOfParcels: data.nParcels}
            //maybe needed, upset true, new true
        ).then(()=>{
            res.status(200).json({"message": "Number of Parcels have been updated."})
        })
    }
    catch(err){
        res.status(200).json({"message": err})
    }
}

export async function setNumberOfParcelsMissing(req, res){
    try{ 
        const {date, nMissing} = req.body
        const data = {date: new Date(date).setHours(0,0,0,0), numberOfParcelsMissing:nMissing}
        await Dispatch.findOneAndUpdate(
            {date: data.date},
            {numberOfParcelsMissing: data.nMissing},
            //maybe needed, upset true, new true
        ).then(()=>{
            res.status(200).json({"message": "Number of Missing parcels have been set."})
        })
    }
    catch(err){
        res.status(200).json({"message": err})
    }
}

export async function getNumberOfWavesToday(req, res){
    try {
        const date = new Date();
        date.setHours(0,0,0,0);
        const waveDetails = await Dispatch.findOne({date: date})
        res.status(200).json({"message": waveDetails})
    } catch(err){
        res.status(200).json({"message": err})
    }
}