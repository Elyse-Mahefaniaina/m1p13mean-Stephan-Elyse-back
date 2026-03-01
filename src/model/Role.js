const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    }
}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;