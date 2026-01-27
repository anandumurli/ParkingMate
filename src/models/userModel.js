import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    role: {
        type: String,
        required: true,
        enum: ['admin', 'csr', 'marshal']
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}
)

const User = mongoose.model("Auth", userSchema);
export default User;