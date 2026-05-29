import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineCreditCard, HiOutlineMenu, HiOutlineX, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { logout } from '../store/userSlice';
import { useTheme } from '../context/ThemeContext';
import API from '../utils/api';

const Navbar = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (err) {
            // ignore
        }
        dispatch(logout());
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
            style={{ padding: '12px 0' }}
        >
            <div className="section-container flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--gradient-primary)' }}>
                        <HiOutlineSparkles className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                        InterviewIQ
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="no-underline text-sm font-medium"
                                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                Dashboard
                            </Link>
                            <Link to="/pricing" className="no-underline text-sm font-medium"
                                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                Pricing
                            </Link>

                            {/* Credits Badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid var(--border-accent)'
                                }}>
                                <HiOutlineCreditCard className="text-sm" style={{ color: 'var(--primary-400)' }} />
                                <span className="text-sm font-semibold" style={{ color: 'var(--primary-300)' }}>
                                    {user.credits} Credits
                                </span>
                            </div>

                            {/* Avatar + Dropdown */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    style={{ border: '2px solid var(--primary-500)' }}
                                />
                                <button onClick={handleLogout} className="btn-secondary"
                                    style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/pricing" className="no-underline text-sm font-medium"
                                style={{ color: 'var(--text-secondary)' }}>
                                Pricing
                            </Link>
                            <Link to="/login">
                                <button className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.875rem' }}>
                                    Get Started
                                </button>
                            </Link>
                        </>
                    )}
                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid var(--border-accent)',
                            borderRadius: '10px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--primary-400)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {theme === 'dark' ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
                    </motion.button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
                    style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {menuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass"
                        style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '12px' }}
                    >
                        <div className="section-container py-4 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="no-underline py-2 text-sm font-medium"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <Link to="/pricing" className="no-underline py-2 text-sm font-medium"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => setMenuOpen(false)}>
                                        Pricing
                                    </Link>
                                    <div className="flex items-center gap-2 py-2">
                                        <HiOutlineCreditCard style={{ color: 'var(--primary-400)' }} />
                                        <span className="text-sm font-semibold" style={{ color: 'var(--primary-300)' }}>
                                            {user.credits} Credits
                                        </span>
                                    </div>
                                    <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                                        className="btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/pricing" className="no-underline py-2 text-sm"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => setMenuOpen(false)}>
                                        Pricing
                                    </Link>
                                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                                        <button className="btn-primary" style={{ width: '100%' }}>
                                            Get Started
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
