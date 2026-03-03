const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    originalPrice: {
        type: Number
    },
    image: {
        type: String
    },
    rating: {
        type: Number,
    },
    reviews: {
        type: Number
    }

}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

productSchema.virtual("details", {
    ref: "ProductDetail",
    localField: "_id",
    foreignField: "product",
    justOne: false
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;