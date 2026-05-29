import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlineClock } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { setCurrentInterview } from '../store/interviewSlice';
import toast from 'react-hot-toast';

const Interview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [feedbackHistory, setFeedbackHistory] = useState([]);
    const [completing, setCompleting] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchInterview();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [feedbackHistory, currentIdx]);

    const fetchInterview = async () => {
        try {
            const res = await API.get(`/interview/${id}`);
            if (res.data.success) {
                const data = res.data.interview;
                setInterview(data);
                setCurrentIdx(data.currentQuestion || 0);

                // Reconstruct feedback history from already-answered questions
                const history = [];
                data.questions.forEach((q, i) => {
                    if (q.answer) {
                        history.push({
                            questionIdx: i,
                            question: q.question,
                            type: q.type,
                            answer: q.answer,
                            feedback: q.feedback,
                            score: q.score,
                        });
                    }
                });
                setFeedbackHistory(history);

                if (data.status === 'completed') {
                    navigate(`/results/${id}`);
                }
            }
        } catch (err) {
            toast.error('Interview not found');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            toast.error('Please type your answer');
            return;
        }

        const currentQuestion = interview.questions[currentIdx];

        try {
            setSubmitting(true);
            const res = await API.post('/interview/answer', {
                interviewId: id,
                questionId: currentQuestion._id,
                answer: answer.trim(),
            });

            if (res.data.success) {
                setFeedbackHistory(prev => [...prev, {
                    questionIdx: currentIdx,
                    question: currentQuestion.question,
                    type: currentQuestion.type,
                    answer: answer.trim(),
                    feedback: res.data.evaluation.feedback,
                    score: res.data.evaluation.score,
                }]);

                setCurrentIdx(res.data.currentQuestion);
                setAnswer('');
            }
        } catch (err) {
            toast.error('Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCompleteInterview = async () => {
        try {
            setCompleting(true);
            const res = await API.post('/interview/complete', { interviewId: id });
            if (res.data.success) {
                toast.success('Interview completed! 🎉');
                navigate(`/results/${id}`);
            }
        } catch (err) {
            toast.error('Failed to complete interview');
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!interview) return null;

    const isAllAnswered = currentIdx >= interview.totalQuestions;
    const progress = (currentIdx / interview.totalQuestions) * 100;

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{ flex: 1, paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
                {/* Header Bar */}
                <div className="glass" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="section-container flex items-center justify-between">
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {interview.jobRole} Interview
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Question {Math.min(currentIdx + 1, interview.totalQuestions)} of {interview.totalQuestions}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Progress Bar */}
                            <div style={{
                                width: '120px',
                                height: '6px',
                                borderRadius: '3px',
                                background: 'rgba(99, 102, 241, 0.15)',
                                overflow: 'hidden',
                            }}>
                                <motion.div
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        height: '100%',
                                        borderRadius: '3px',
                                        background: 'var(--gradient-primary)',
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-400)' }}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 0' }}>
                    <div className="section-container" style={{ maxWidth: '800px' }}>
                        <AnimatePresence>
                            {feedbackHistory.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginBottom: '24px' }}
                                >
                                    {/* AI Question */}
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                            background: 'var(--gradient-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <HiOutlineSparkles size={16} color="white" />
                                        </div>
                                        <div className="glass-card" style={{ padding: '16px', flex: 1 }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                                                color: item.type === 'technical' ? '#06b6d4' : item.type === 'hr' ? '#f59e0b' : '#8b5cf6',
                                                marginBottom: '6px', display: 'block',
                                            }}>
                                                {item.type} Question
                                            </span>
                                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{item.question}</p>
                                        </div>
                                    </div>

                                    {/* User Answer */}
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', justifyContent: 'flex-end' }}>
                                        <div style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            background: 'rgba(99, 102, 241, 0.15)',
                                            border: '1px solid var(--border-accent)',
                                            maxWidth: '80%',
                                        }}>
                                            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                                {item.answer}
                                            </p>
                                        </div>
                                        <img
                                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=36`}
                                            alt="" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* AI Feedback */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ width: '36px', flexShrink: 0 }} />
                                        <div style={{
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: item.score >= 7 ? 'rgba(16, 185, 129, 0.08)' : item.score >= 4 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            border: `1px solid ${item.score >= 7 ? 'rgba(16, 185, 129, 0.2)' : item.score >= 4 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                            flex: 1,
                                        }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span style={{
                                                    fontWeight: 700, fontSize: '0.85rem',
                                                    color: item.score >= 7 ? '#10b981' : item.score >= 4 ? '#f59e0b' : '#ef4444',
                                                }}>
                                                    Score: {item.score}/10
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                                                {item.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Current Question */}
                        {!isAllAnswered && (
                            <motion.div
                                key={`q-${currentIdx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <HiOutlineSparkles size={16} color="white" />
                                </div>
                                <div className="glass-card animate-pulse-glow" style={{ padding: '16px', flex: 1 }}>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                                        color: interview.questions[currentIdx]?.type === 'technical' ? '#06b6d4'
                                            : interview.questions[currentIdx]?.type === 'hr' ? '#f59e0b' : '#8b5cf6',
                                        marginBottom: '6px', display: 'block',
                                    }}>
                                        {interview.questions[currentIdx]?.type} Question
                                    </span>
                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        {interview.questions[currentIdx]?.question}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Complete Interview */}
                        {isAllAnswered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card"
                                style={{ padding: '32px', textAlign: 'center' }}
                            >
                                <HiOutlineSparkles size={40} style={{ color: 'var(--primary-400)', margin: '0 auto 16px' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                                    All Questions Answered! 🎉
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                    Click below to get your comprehensive AI-generated feedback and score.
                                </p>
                                <button
                                    className="btn-primary"
                                    onClick={handleCompleteInterview}
                                    disabled={completing}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                >
                                    {completing ? (
                                        <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Generating Results...</>
                                    ) : (
                                        <>Get Results →</>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Answer Input */}
                {!isAllAnswered && (
                    <div className="glass" style={{ padding: '16px 0', borderTop: '1px solid var(--border-subtle)' }}>
                        <div className="section-container flex gap-3" style={{ maxWidth: '800px' }}>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                rows={3}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-accent)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    resize: 'none',
                                    outline: 'none',
                                    fontFamily: 'var(--font-sans)',
                                    lineHeight: 1.5,
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmitAnswer();
                                    }
                                }}
                                disabled={submitting}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                                onClick={handleSubmitAnswer}
                                disabled={submitting || !answer.trim()}
                                style={{
                                    alignSelf: 'flex-end',
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: submitting || !answer.trim() ? 0.6 : 1,
                                }}
                            >
                                {submitting ? (
                                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                ) : (
                                    <HiOutlinePaperAirplane size={18} style={{ transform: 'rotate(90deg)' }} />
                                )}
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interview;
