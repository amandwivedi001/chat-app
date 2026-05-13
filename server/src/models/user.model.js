import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const UserSchema = new Schema({
    Username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    }
}, { timestamps: true });


UserSchema.pre("save",async function (next) {
   if (!this.isModified("password")) return next;

   await bcrypt.hash(this.password, 10).then(hash => {
      this.password = hash;
      next;
   });
});

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
}

export const User = mongoose.model("User", UserSchema);