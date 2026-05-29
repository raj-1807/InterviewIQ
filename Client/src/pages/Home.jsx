import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Typewriter from 'typewriter-effect';
import {
    HiOutlineSparkles,
    HiOutlineDocumentText,
    HiOutlineChatAlt2,
    HiOutlineChartBar,
    HiOutlineLightningBolt,
    HiOutlineShieldCheck,
    HiOutlineCurrencyRupee,
} from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
    {
        icon: <HiOutlineDocumentText size={28} />,
        title: 'Resume Analysis',
        desc: 'Upload your PDF resume and let AI analyze your skills, experience, and strengths to generate personalized questions.',
        color: '#6366f1',
    },
    {
        icon: <HiOutlineChatAlt2 size={28} />,
        title: 'AI Interview',
        desc: 'Practice with AI-generated technical, behavioral, and HR questions tailored to your target role.',
        color: '#06b6d4',
    },
    {
        icon: <HiOutlineChartBar size={28} />,
        title: 'Smart Feedback',
        desc: 'Get detailed feedback on each answer with scores, strengths, and areas for improvement.',
        color: '#10b981',
    },
    {
        icon: <HiOutlineLightningBolt size={28} />,
        title: 'Instant Results',
        desc: 'Receive comprehensive performance reports with actionable insights to boost your interview skills.',
        color: '#f59e0b',
    },
    {
        icon: <HiOutlineShieldCheck size={28} />,
        title: 'Secure & Private',
        desc: 'Your data is encrypted and never shared. Practice with complete privacy and confidence.',
        color: '#8b5cf6',
    },
    {
        icon: <HiOutlineCurrencyRupee size={28} />,
        title: 'Affordable Plans',
        desc: 'Start with 5 free credits. Purchase more anytime with our flexible credit-based pricing.',
        color: '#ec4899',
    },
];

const pricingPlans = [
    {
        name: 'Free',
        price: '₹0',
        credits: 5,
        features: ['5 Interview Sessions', 'Resume Upload', 'AI-Generated Questions', 'Basic Feedback'],
        popular: false,
        id: 'free',
    },
    {
        name: 'Basic',
        price: '₹99',
        credits: 10,
        features: ['10 Interview Sessions', 'Resume Upload', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics'],
        popular: false,
        id: 'basic',
    },
    {
        name: 'Standard',
        price: '₹199',
        credits: 25,
        features: ['25 Interview Sessions', 'Resume Upload', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics', 'Priority Support'],
        popular: true,
        id: 'standard',
    },
    {
        name: 'Premium',
        price: '₹399',
        credits: 60,
        features: ['60 Interview Sessions', 'Resume Upload', 'AI-Generated Questions', 'Detailed Feedback', 'Score Analytics', 'Priority Support', 'Download Reports'],
        popular: false,
        id: 'premium',
    },
];

const Home = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{ paddingTop: '140px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
                {/* Particle Background */}
                <ParticleBackground />
                {/* Background Glow Orbs */}
                <div className="glow-orb glow-orb-primary" style={{ width: '500px', height: '500px', top: '-100px', right: '-100px' }} />
                <div className="glow-orb glow-orb-accent" style={{ width: '400px', height: '400px', bottom: '-50px', left: '-100px' }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '9999px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid var(--border-accent)',
                                marginBottom: '24px',
                                fontSize: '0.85rem',
                                color: 'var(--primary-300)',
                                fontWeight: 500,
                            }}
                        >
                            <HiOutlineSparkles /> Powered by Google Gemini AI
                        </motion.div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            fontFamily: 'var(--font-display)',
                        }}>
                            Ace Your Next{' '}
                            <span className="gradient-text" style={{ display: 'inline-block', minWidth: '280px' }}>
                                <Typewriter
                                    options={{
                                        strings: [
                                            'Frontend Interview',
                                            'Backend Interview',
                                            'Data Science Interview',
                                            'System Design Interview',
                                            'HR Interview',
                                            'DevOps Interview',
                                        ],
                                        autoStart: true,
                                        loop: true,
                                        deleteSpeed: 30,
                                        delay: 60,
                                    }}
                                />
                            </span>
                        </h1>

                        <p style={{
                            fontSize: '1.15rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.7,
                            marginBottom: '40px',
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                        }}>
                            Upload your resume, get personalized interview questions, and receive
                            intelligent feedback — all powered by advanced AI. Start practicing in seconds.
                        </p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                            <Link to={user ? '/dashboard' : '/login'}>
                                <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                                    {user ? 'Go to Dashboard' : 'Start Free — 5 Credits'}
                                </button>
                            </Link>
                            <a href="#features">
                                <button className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                                    Learn More ↓
                                </button>
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '48px',
                                marginTop: '64px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {[
                                { value: '10K+', label: 'Interviews' },
                                { value: '95%', label: 'Satisfaction' },
                                { value: '50+', label: 'Job Roles' },
                            ].map((stat) => (
                                <div key={stat.label} style={{ textAlign: 'center' }}>
                                    <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '80px 0', position: 'relative' }}>
                <div className="section-container">
                    <motion.div
                        {...fadeInUp}
                        viewport={{ once: true }}
                        whileInView="animate"
                        initial="initial"
                        style={{ textAlign: 'center', marginBottom: '56px' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                            fontWeight: 700,
                            marginBottom: '16px',
                            fontFamily: 'var(--font-display)',
                        }}>
                            Everything You Need to{' '}
                            <span className="gradient-text-accent">Succeed</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                            Our AI-powered platform provides a complete interview preparation experience.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-card"
                                style={{ padding: '32px' }}
                            >
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `${feature.color}15`,
                                    color: feature.color,
                                    marginBottom: '20px',
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '10px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
                <div className="section-container">
                    <motion.div
                        {...fadeInUp}
                        whileInView="animate"
                        initial="initial"
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '56px' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                            fontWeight: 700,
                            marginBottom: '16px',
                            fontFamily: 'var(--font-display)',
                        }}>
                            How It <span className="gradient-text">Works</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Upload Resume', desc: 'Upload your PDF resume and select your target job role.' },
                            { step: '02', title: 'Answer Questions', desc: 'AI generates personalized questions. Answer them at your own pace.' },
                            { step: '03', title: 'Get Feedback', desc: 'Receive detailed feedback, scores, and improvement suggestions.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                style={{ textAlign: 'center', padding: '32px' }}
                            >
                                <div className="gradient-text" style={{
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-display)',
                                    marginBottom: '16px',
                                    opacity: 0.6,
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{ padding: '80px 0' }}>
                <div className="section-container">
                    <motion.div
                        {...fadeInUp}
                        whileInView="animate"
                        initial="initial"
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '56px' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                            fontWeight: 700,
                            marginBottom: '16px',
                            fontFamily: 'var(--font-display)',
                        }}>
                            Simple, <span className="gradient-text-accent">Transparent</span> Pricing
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Start free. Upgrade when you need more.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pricingPlans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="glass-card"
                                style={{
                                    padding: '32px',
                                    position: 'relative',
                                    border: plan.popular ? '2px solid var(--primary-500)' : undefined,
                                }}
                            >
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'var(--gradient-primary)',
                                        padding: '4px 16px',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'white',
                                    }}>
                                        Most Popular
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
                                    {plan.name}
                                </h3>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                        {plan.price}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                    {plan.credits} interview credits
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                                    {plan.features.map((feat, j) => (
                                        <li key={j} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '6px 0',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                        }}>
                                            <span style={{ color: 'var(--success-500)' }}>✓</span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Link to={plan.id === 'free' ? '/login' : '/pricing'} style={{ textDecoration: 'none' }}>
                                    <button
                                        className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                                        style={{ width: '100%' }}
                                    >
                                        {plan.id === 'free' ? 'Get Started Free' : 'Buy Credits'}
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{
                            padding: '64px 32px',
                            maxWidth: '700px',
                            margin: '0 auto',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div className="glow-orb glow-orb-primary" style={{ width: '300px', height: '300px', top: '-100px', right: '-100px' }} />
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                            fontWeight: 700,
                            marginBottom: '16px',
                            fontFamily: 'var(--font-display)',
                            position: 'relative',
                        }}>
                            Ready to Ace Your Interview?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', position: 'relative' }}>
                            Join thousands of candidates who improved their interview skills with InterviewIQ.
                        </p>
                        <Link to={user ? '/dashboard' : '/login'} style={{ position: 'relative' }}>
                            <button className="btn-primary" style={{ padding: '14px 40px', fontSize: '1.05rem' }}>
                                {user ? 'Go to Dashboard' : 'Start Practicing Now →'}
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
