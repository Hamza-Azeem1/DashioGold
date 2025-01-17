const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: String,
    email: String,
    phone: String,
    address: String,
    shippingAddress: String,
    city: String,
    postalCode: String,
    paymentMethod: String,
    countryCode: String,
    country: String,
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: Number,
        sellingPrice: Number
    }],
    totalPrice: Number,
    shippingCharges: Number,
    totalAmount: Number,
    discountApplied: {
        type: Number,
        default: 0
    },
    cashbackEarned: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Received', 'Pending', 'Transit', 'Delivered'],
        default: 'Received'
    },
    statusHistory: [{
        status: String,
        timestamp: Date
    }]
}, {
    timestamps: true
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;