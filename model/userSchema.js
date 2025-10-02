import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    blocked: { type: Boolean, default: false },
})

export default mongoose.model("user", userSchema);
