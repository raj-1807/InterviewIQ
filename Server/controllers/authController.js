import jwt from 'jsonwebtoken';
import admin from '../config/firebase.js';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Authenticate user with Firebase token
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Firebase token is required' });
        }

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Find or create user
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                name: name || email?.split('@')[0] || 'User',
                email,
                firebaseUid: uid,
                photoURL: picture || '',
                credits: 5,
            });
        }

        // Generate JWT
        const jwtToken = generateToken(user._id);

        // Set cookie
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                credits: user.credits,
                plan: user.plan,
            },
            token: jwtToken,
        });
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ success: false, message: 'Authentication failed' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                credits: user.credits,
                plan: user.plan,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
