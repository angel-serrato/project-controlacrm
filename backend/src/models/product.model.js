import mongoose from "mongoose"

const { Schema, model } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    category: String,
}, { timestamps: true })

const Product = model("Product", productSchema)
export default Product