import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: String,
    address: String,
    company: String,
}, { timestamps: true })

const Customer = mongoose.model("Customer", customerSchema)
export default Customer