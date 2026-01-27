import mongoose from "mongoose"
// can add created@, expiresBy, IP, device, revoked@
const tokenScehma = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    tokenHash: {
        type: String,
        required: true
    }
})

const Token = mongoose.model("Token", tokenScehma);
export default Token;