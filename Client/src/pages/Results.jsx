import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import {
    HiOutlineChartBar,
    HiOutlineLightningBolt,
    HiOutlineTrendingUp,
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineDownload,
    HiOutlineMail,
} from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Results = () => {
    const { id } = useParams();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [emailing, setEmailing] = useState(false);
    const resultsRef = useRef(null);

    const handleEmailResults = async () => {
        setEmailing(true);
        try {
            const res = await API.post(`/interview/${id}/email`);
            if (res.data.success) {
                toast.success('Results sent to your email! 📧');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send email');
        } finally {
            setEmailing(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!resultsRef.current) return;
        setDownloading(true);
        try {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `InterviewIQ_${interview.jobRole.replace(/\s+/g, '_')}_Report.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0a0a1a' },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };
            await html2pdf().set(opt).from(resultsRef.current).save();
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await API.get(`/interview/${id}`);
                if (res.data.success) {
                    setInterview(res.data.interview);
                }
            } catch (err) {
                console.error('Failed to fetch results:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!interview) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Interview not found.</p>
            </div>
        );
    }

    const scoreColor = interview.overallScore >= 70 ? '#10b981' : interview.overallScore >= 40 ? '#f59e0b' : '#ef4444';
    const scoreLabel = interview.overallScore >= 70 ? 'Excellent' : interview.overallScore >= 40 ? 'Good' : 'Needs Improvement';

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar />

            <div className="section-container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '900px' }}>
                {/* Back + Download Buttons */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/dashboard" className="flex items-center gap-2 no-underline"
                        style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <HiOutlineArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary"
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '0.85rem' }}
                    >
                        {downloading ? (
                            <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Generating...</>
                        ) : (
                            <><HiOutlineDownload size={16} /> Download PDF</>
                        )}
                    </motion.button>
                </div>

                <div ref={resultsRef}>

                {/* Score Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '40px', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}
                >
                    <div className="glow-orb" style={{
                        width: '300px', height: '300px',
                        background: scoreColor, opacity: 0.1,
                        top: '-100px', right: '-100px',
                        position: 'absolute', borderRadius: '50%', filter: 'blur(80px)',
                    }} />

                    <h1 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', position: 'relative' }}>
                        {interview.jobRole} Interview Results
                    </h1>

                    {/* Circular Score */}
                    <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 20px' }}>
                        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                            <motion.circle
                                cx="80" cy="80" r="70" fill="none"
                                stroke={scoreColor}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 70}
                                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - interview.overallScore / 100) }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                style={{ fontSize: '2.5rem', fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display)' }}
                            >
                                {interview.overallScore}
                            </motion.span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>out of 100</span>
                        </div>
                    </div>

                    <span style={{
                        display: 'inline-block',
                        padding: '6px 20px',
                        borderRadius: '9999px',
                        background: `${scoreColor}15`,
                        color: scoreColor,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: `1px solid ${scoreColor}30`,
                    }}>
                        {scoreLabel}
                    </span>
                </motion.div>

                {/* Overall Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card"
                    style={{ padding: '28px', marginBottom: '24px' }}
                >
                    <h2 className="flex items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
                        <HiOutlineChartBar size={20} style={{ color: 'var(--primary-400)' }} />
                        Overall Feedback
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {interview.overallFeedback}
                    </p>
                </motion.div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ padding: '24px' }}
                    >
                        <h3 className="flex items-center gap-2" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#10b981' }}>
                            <HiOutlineCheckCircle size={20} /> Strengths
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {interview.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start gap-2" style={{ padding: '6px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ color: '#10b981', marginTop: '2px' }}>✓</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card"
                        style={{ padding: '24px' }}
                    >
                        <h3 className="flex items-center gap-2" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: '#f59e0b' }}>
                            <HiOutlineExclamationCircle size={20} /> Areas for Improvement
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {interview.improvements?.map((s, i) => (
                                <li key={i} className="flex items-start gap-2" style={{ padding: '6px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ color: '#f59e0b', marginTop: '2px' }}>→</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Question-by-Question */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="flex items-center gap-2" style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px' }}>
                        <HiOutlineLightningBolt size={20} style={{ color: 'var(--primary-400)' }} />
                        Question-by-Question Review
                    </h2>

                    {interview.questions?.map((q, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="glass-card"
                            style={{ padding: '24px', marginBottom: '12px' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 700,
                                        padding: '3px 10px', borderRadius: '6px',
                                        background: q.type === 'technical' ? 'rgba(6, 182, 212, 0.1)' : q.type === 'hr' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                        color: q.type === 'technical' ? '#06b6d4' : q.type === 'hr' ? '#f59e0b' : '#8b5cf6',
                                        textTransform: 'uppercase',
                                    }}>
                                        {q.type}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Q{i + 1}</span>
                                </div>
                                <span style={{
                                    fontWeight: 700, fontSize: '0.9rem',
                                    color: q.score >= 7 ? '#10b981' : q.score >= 4 ? '#f59e0b' : '#ef4444',
                                }}>
                                    {q.score}/10
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '10px', lineHeight: 1.5 }}>
                                {q.question}
                            </p>
                            {q.answer && (
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(99, 102, 241, 0.05)',
                                    marginBottom: '10px',
                                    borderLeft: '3px solid var(--primary-500)',
                                }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        <strong>Your Answer:</strong> {q.answer}
                                    </p>
                                </div>
                            )}
                            {q.feedback && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                    💡 {q.feedback}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center flex-wrap mt-8">
                    <Link to="/dashboard">
                        <button className="btn-secondary">Back to Dashboard</button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-secondary"
                        onClick={handleEmailResults}
                        disabled={emailing}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {emailing ? (
                            <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Sending...</>
                        ) : (
                            <><HiOutlineMail size={16} /> Email Results</>
                        )}
                    </motion.button>
                    <Link to="/dashboard">
                        <button className="btn-primary">Start New Interview</button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Results;
