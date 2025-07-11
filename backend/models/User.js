const mongoose = require("mongoose");

const UserScehma = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageUrl:{
            type:String,
            required:true,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserScehma);

