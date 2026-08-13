import mongoose from "mongoose"
const PermissionsSchema = new mongoose.Schema({
    canManageUsers: {type: Boolean, default: false},
    canUploadRouteManifest: {type: Boolean, default: false},
    canUploadDriverManifest: {type: Boolean, default: false},
    canAddRemoveWaves: {type: Boolean, default: false},
    canDownloadReports: {type: Boolean, default: false},
}, { _id: false });


const userSchema = new mongoose.Schema({

    role: {
        type: String,
        required: true,
        enum: ['admin', 'csr', 'marshal', 'supervisor']
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    permissions: {
        type: PermissionsSchema,
        default: () => ({})
    }
}
)

const User = mongoose.model("Auth", userSchema);
export default User;