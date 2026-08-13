import mongoose from "mongoose"
// i want the details of who performed the audit, -- the only important thing here.

// so one thing you should understand is, the audit is performed for only the 
// vehicles/drivers who are missing boxes, but if no audit is performed means 
// according to the warehouse management system the driver never missed any boxes. 
// this is essential because it helps us understand who is missing boxes.

//need to ensure that wave numbers are unique, but that should be based on the date,
//essentially we need to ensure that no one is entering a car that is already in the warehouse,
//maybe that can be done from the front end.
const carDataSchema = new mongoose.Schema({
    driverID: {
        type: String,
        required: true
    },
    vinNo: {
        type: String,
        required: true
        //this would require the vin validation logic
    },
    licenseNo: {
        type: String,
        required: true
        //requires validation logic
    },
    routeNo: {
        type: String,
        required: true
    },
    wave: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true
    },
    checkInStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    checkOutStatus: {
        type: Boolean,
        required: false,
        defualt: false
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date,
        required: false
    },
    auditStatus: {
        type: String,
        required: false,
        enum: ['requested', 'notRequested', 'done'],
        default: 'notRequested'
    },
    loadingStatus: {
        type: String,
        required: false,
        enum: ['loadingStarted', 'loadingEnded', 'awaitingSignoff'],
        default: 'awaitingSignoff'
    },
    packagesFound: {
        type: String,
        required: false
    },
    packagesHanded: {
        type: String,
        required: false
    },
    packagesMissing: {
        type: String,
        required: false
    },
    incorrectPacakged:{
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
    //the package portion might change.
})

const Car = mongoose.model("car", carDataSchema);
export default Car;