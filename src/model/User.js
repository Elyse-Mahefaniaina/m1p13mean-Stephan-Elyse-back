const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: { 
        createdAt: "createdAt", 
        updatedAt: "modifiedAt" 
    }
});

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;