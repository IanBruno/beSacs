import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Por favor introduce tu correo'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Intriduce un email valido"],
        minlength: [3, 'El correo debe contener al menos 3 caracteres']
    },
    username: {
        type: String,
        required: [true, 'Por favor ingresa tu nombre'],
        trim: true,
        minlength: [3, 'Tu nombre debe tener al menos 3 caracteres']
    },
    password: {
        type: String,
        required: [true, 'Por favor introduce tu contraseña'],
        minlength: [6, 'La contraseña debe contener mínimo 6 caracteres'],
        select: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);    
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;