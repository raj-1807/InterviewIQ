import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { setUser, setLoading, setError } from '../store/userSlice';
import API from '../utils/api';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const Login = () => {
    const [loading, setLoadingState] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            setLoadingState(true);
            dispatch(setLoading());

            // Sign in with Google via Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseToken = await result.user.getIdToken();

            // Send token to our backend
            const response = await API.post('/auth/google', { token: firebaseToken });

            if (response.data.success) {
                dispatch(setUser({
                    user: response.data.user,
                    token: response.data.token,
                }));
                toast.success('Welcome to InterviewIQ! 🎉');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch(setError(error.message));
            toast.error('Login failed. Please try again.');
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px',
        }}>
            {/* Background Glow */}
            <div className="glow-orb glow-orb-primary" style={{ width: '600px', height: '600px', top: '-200px', right: '-200px' }} />
            <div className="glow-orb glow-orb-accent" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px' }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="glass-card"
                style={{
                    padding: '48px 40px',
                    maxWidth: '440px',
                    width: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--gradient-primary)',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
                    }}
                >
                    <HiOutlineSparkles size={32} color="white" />
                </motion.div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    fontFamily: 'var(--font-display)',
                }}>
                    Welcome to <span className="gradient-text">InterviewIQ</span>
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    marginBottom: '36px',
                    lineHeight: 1.5,
                }}>
                    Sign in to start your AI-powered interview practice journey.
                </p>

                {/* Google Sign-In Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px 24px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-accent)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease',
                        opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => {
                        if (!loading) e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={e => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                >
                    {loading ? (
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                    ) : (
                        <>
                            <FcGoogle size={22} />
                            Continue with Google
                        </>
                    )}
                </motion.button>

                {/* Divider */}
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-subtle)',
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* Free Credits Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>
                        🎉 Get 5 free interview credits on signup!
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
