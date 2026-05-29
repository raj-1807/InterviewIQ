import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineLightningBolt } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { updateCredits } from '../store/userSlice';
import toast from 'react-hot-toast';

const packages = [
    {
        id: 'basic',
        name: 'Basic Pack',
        credits: 10,
        price: 99,
        displayPrice: '₹99',
        perCredit: '₹9.9/credit',
        features: ['10 Interview Credits', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics'],
        popular: false,
        color: '#06b6d4',
    },
    {
        id: 'standard',
        name: 'Standard Pack',
        credits: 25,
        price: 199,
        displayPrice: '₹199',
        perCredit: '₹7.96/credit',
        features: ['25 Interview Credits', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics', 'Priority Support'],
        popular: true,
        color: '#6366f1',
    },
    {
        id: 'premium',
        name: 'Premium Pack',
        credits: 60,
        price: 399,
        displayPrice: '₹399',
        perCredit: '₹6.65/credit',
        features: ['60 Interview Credits', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics', 'Priority Support', 'Download Reports'],
        popular: false,
        color: '#8b5cf6',
    },
];

const PricingPage = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loadingPkg, setLoadingPkg] = useState(null);

    const handleBuyCredits = async (packageId) => {
        if (!user) {
            toast.error('Please login first');
            return;
        }

        try {
            setLoadingPkg(packageId);

            // Create order
            const orderRes = await API.post('/payment/create-order', { packageId });
            if (!orderRes.data.success) {
                throw new Error('Failed to create order');
            }

            const { order, key } = orderRes.data;

            // Open Razorpay Checkout
            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: 'InterviewIQ',
                description: `Purchase ${packages.find(p => p.id === packageId)?.credits} Credits`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // Verify payment
                        const verifyRes = await API.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            dispatch(updateCredits(verifyRes.data.credits));
                            toast.success(verifyRes.data.message);
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#6366f1',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed');
        } finally {
            setLoadingPkg(null);
        }
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar />

            <div className="section-container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '56px' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        marginBottom: '12px',
                    }}>
                        Buy <span className="gradient-text">Interview Credits</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                        Each credit = 1 complete interview session with AI feedback.
                        {user && (
                            <span style={{ display: 'block', marginTop: '8px', color: 'var(--primary-400)', fontWeight: 600 }}>
                                Current balance: {user.credits} credits
                            </span>
                        )}
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: '960px', margin: '0 auto' }}>
                    {packages.map((pkg, i) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="glass-card"
                            style={{
                                padding: '36px 28px',
                                position: 'relative',
                                border: pkg.popular ? '2px solid var(--primary-500)' : undefined,
                                transform: pkg.popular ? 'scale(1.03)' : undefined,
                            }}
                        >
                            {pkg.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-14px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--gradient-primary)',
                                    padding: '5px 20px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    <HiOutlineLightningBolt size={14} /> Best Value
                                </div>
                            )}

                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                marginBottom: '4px',
                                color: pkg.color,
                            }}>
                                {pkg.name}
                            </h3>

                            <div style={{ marginBottom: '4px' }}>
                                <span style={{
                                    fontSize: '2.75rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-display)',
                                }}>
                                    {pkg.displayPrice}
                                </span>
                            </div>

                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                marginBottom: '24px',
                            }}>
                                {pkg.perCredit} • {pkg.credits} credits
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                                {pkg.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-2" style={{
                                        padding: '5px 0',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        <HiOutlineCheckCircle size={16} style={{ color: pkg.color, flexShrink: 0 }} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={pkg.popular ? 'btn-primary' : 'btn-secondary'}
                                style={{ width: '100%' }}
                                onClick={() => handleBuyCredits(pkg.id)}
                                disabled={loadingPkg === pkg.id}
                            >
                                {loadingPkg === pkg.id ? (
                                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', margin: '0 auto' }} />
                                ) : (
                                    `Buy ${pkg.credits} Credits`
                                )}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card"
                    style={{
                        padding: '24px',
                        maxWidth: '600px',
                        margin: '48px auto 0',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        🔒 Secure payments powered by <strong style={{ color: 'var(--text-primary)' }}>Razorpay</strong>.
                        Credits never expire. Use them anytime.
                    </p>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default PricingPage;
