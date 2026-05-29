import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    photoURL: {
        type: String,
        default: '',
    },
    credits: {
        type: Number,
        default: 5, // 5 free credits on signup
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
