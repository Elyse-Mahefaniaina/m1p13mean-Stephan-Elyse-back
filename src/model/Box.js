const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    zone: {
        type: String,
        required: true,
    },
    dimensions: {
        type: String,
        required: true        
    },
    status: {
        type: String,
        enum: ['occupied', 'free', 'reserved', 'under_repair'],
        default: 'free',
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    charges: {
        type: Number,
        required: true,
    },
    paymentDay: {
        type: Number,
        required: true
    }

}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

const Box = mongoose.model("Box", boxSchema);

module.exports = Box;