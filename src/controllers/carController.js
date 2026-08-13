import { syncIndexes } from "mongoose"
import Car from "../models/carData.js"

export async function getAllCarsToday(req, res) {
    try {
        var date = new Date()
        date.setHours(0,0,0,0)
        const allCars = await Car.find({date: date})
        res.status(200).json({"message": allCars})
    }
    catch(err){
        res.status(200).json({"message": err})
    }
}

export async function parkNewCar(req, res){
    try{
        const {driverID, vinNo, licenseNo, routeNo, wave, position} = req.body
        let today = new Date();
        today.setHours(0,0,0,0)
        let now = new Date();
        const carData = {
            "driverID": driverID,
            "vinNo": vinNo,
            "licenseNo": licenseNo,
            "routeNo": routeNo,
            "wave": wave,
            "position": position,
            "date": today,
            "checkInStatus": true,
            "checkInTime": now
        }
        const newCar =  new Car(carData)
        newCar.save().then(()=>{
            res.status(200).json({"message": "Car Saved", "car": newCar})
        });
    }catch(err){
        res.status(200).json({"message": err})
    }
}