import mongoose from 'mongoose'

export const connectDB = async () =>{ 
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("db connected.")
    }
    catch(err){
        console.log("error with db connection", err)
        process.exit(1);
    }
}

