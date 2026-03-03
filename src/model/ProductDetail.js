const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    images: [
        {
            type: String
        }
    ],
    variants: [
        {
            type: {
                type: String,
                required: true
            },
            options: [
                {
                    type: String
                }
            ]
        }
    ],
    specifications: [
        {
            key: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],
    detailedReviews: [
        {
            userName: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comment: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);

module.exports = ProductDetail;