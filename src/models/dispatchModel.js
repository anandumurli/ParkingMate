import mongoose from "mongoose"

const dispatchSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    numberOfWaves: {
        type: Number
    },
    numberOfParcels: {
        type: Number
    },
    numberOfParcelsMissing: {
        type: Number
    }
})

const Dispatch = mongoose.model("Dispatch", dispatchSchema);
export default Dispatch;