import mongoose from "mongoose"

const { Schema, model } = mongoose

const orderSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Cantidad debe ser al menos 1"]
    },
    price: {
        type: Number,
        required: true,
    },
})

const Order = model("Order", orderSchema)
export default Order