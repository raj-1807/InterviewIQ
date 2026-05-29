import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    HiOutlinePlus,
    HiOutlineClock,
    HiOutlineChartBar,
    HiOutlineSparkles,
    HiOutlineDocumentText,
    HiOutlineUpload,
} from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { updateCredits } from '../store/userSlice';
import { setCurrentInterview } from '../store/interviewSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [jobRole, setJobRole] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await API.get('/interview/history');
            if (res.data.success) {
                setInterviews(res.data.interviews);
            }
        } catch (err) {
            console.error('Failed to fetch interviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartInterview = async () => {
        if (!jobRole.trim()) {
            toast.error('Please enter a job role');
            return;
        }

        try {
            setStarting(true);

            const formData = new FormData();
            formData.append('jobRole', jobRole.trim());
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }

            const res = await API.post('/interview/start', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                dispatch(setCurrentInterview(res.data.interview));
                dispatch(updateCredits(res.data.remainingCredits));
                toast.success('Interview started!');
                navigate(`/interview/${res.data.interview._id}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setStarting(false);
        }
    };

    const completedCount = interviews.filter(i => i.status === 'completed').length;
    const avgScore = completedCount > 0
        ? Math.round(interviews.filter(i => i.status === 'completed').reduce((sum, i) => sum + i.overallScore, 0) / completedCount)
        : 0;

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar />

            <div className="section-container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            marginBottom: '8px',
                        }}>
                            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Ready for your next interview practice session?
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <HiOutlinePlus size={18} /> Start New Interview
                    </motion.button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
                >
                    {[
                        {
                            icon: <HiOutlineSparkles size={22} />,
                            label: 'Credits Remaining',
                            value: user?.credits || 0,
                            color: '#6366f1',
                        },
                        {
                            icon: <HiOutlineDocumentText size={22} />,
                            label: 'Total Interviews',
                            value: interviews.length,
                            color: '#06b6d4',
                        },
                        {
                            icon: <HiOutlineChartBar size={22} />,
                            label: 'Avg. Score',
                            value: avgScore ? `${avgScore}%` : '--',
                            color: '#10b981',
                        },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${stat.color}15`,
                                color: stat.color,
                                flexShrink: 0,
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Interview History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>
                        Interview History
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div className="spinner" style={{ margin: '0 auto' }} />
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="glass-card" style={{
                            padding: '60px 32px',
                            textAlign: 'center',
                        }}>
                            <HiOutlineDocumentText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
                                No interviews yet
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                                Start your first AI-powered interview practice session!
                            </p>
                            <button className="btn-primary" onClick={() => setShowModal(true)}>
                                Start Interview
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {interviews.map((interview, i) => (
                                <motion.div
                                    key={interview._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link to={interview.status === 'completed' ? `/results/${interview._id}` : `/interview/${interview._id}`}
                                        style={{ textDecoration: 'none' }}>
                                        <div className="glass-card" style={{ padding: '24px', cursor: 'pointer' }}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: interview.status === 'completed'
                                                        ? 'rgba(16, 185, 129, 0.1)'
                                                        : 'rgba(245, 158, 11, 0.1)',
                                                    color: interview.status === 'completed' ? '#10b981' : '#f59e0b',
                                                    border: `1px solid ${interview.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                                }}>
                                                    {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                                                </span>
                                                {interview.status === 'completed' && (
                                                    <span style={{
                                                        fontSize: '1.25rem',
                                                        fontWeight: 700,
                                                        color: interview.overallScore >= 70 ? '#10b981' : interview.overallScore >= 40 ? '#f59e0b' : '#ef4444',
                                                    }}>
                                                        {interview.overallScore}%
                                                    </span>
                                                )}
                                            </div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                                                {interview.jobRole}
                                            </h3>
                                            <div className="flex items-center gap-4" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineClock size={14} />
                                                    {new Date(interview.createdAt).toLocaleDateString()}
                                                </span>
                                                <span>{interview.totalQuestions} questions</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* New Interview Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    padding: '20px',
                }} onClick={() => !starting && setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card"
                        style={{ padding: '36px', maxWidth: '500px', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            marginBottom: '8px',
                            fontFamily: 'var(--font-display)',
                        }}>
                            Start New Interview
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
                            This will use 1 credit. You have <strong style={{ color: 'var(--primary-400)' }}>{user?.credits}</strong> credits remaining.
                        </p>

                        {/* Job Role Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                Target Job Role *
                            </label>
                            <input
                                type="text"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                placeholder="e.g. Frontend Developer, Data Scientist"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-accent)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-accent)'}
                            />
                        </div>

                        {/* Resume Upload */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                Upload Resume (PDF, optional)
                            </label>
                            <div
                                style={{
                                    border: '2px dashed var(--border-accent)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: resumeFile ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                }}
                                onClick={() => document.getElementById('resume-upload').click()}
                            >
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />
                                {resumeFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <HiOutlineDocumentText size={20} style={{ color: '#10b981' }} />
                                        <span style={{ color: '#10b981', fontWeight: 500 }}>{resumeFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <HiOutlineUpload size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            Click to upload PDF resume (max 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                className="btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowModal(false)}
                                disabled={starting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                onClick={handleStartInterview}
                                disabled={starting || user?.credits <= 0}
                            >
                                {starting ? (
                                    <>
                                        <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineSparkles size={16} /> Start Interview
                                    </>
                                )}
                            </button>
                        </div>

                        {user?.credits <= 0 && (
                            <div style={{
                                marginTop: '16px',
                                padding: '10px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                textAlign: 'center',
                            }}>
                                <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                                    No credits remaining.{' '}
                                    <Link to="/pricing" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Buy more →</Link>
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Dashboard;
