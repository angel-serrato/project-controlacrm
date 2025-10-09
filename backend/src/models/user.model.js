import mongoose from "mongoose"

const { Schema, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const User = model("User", userSchema)
export default User