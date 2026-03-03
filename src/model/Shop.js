const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required:  true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [ 'active', 'pending', 'suspended', 'closed'],
        default: 'free',
        required: true
    },
    logo: {
        type: String
    },
    description: {
        type: String
    }

}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;