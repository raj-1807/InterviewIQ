import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '20px',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
            >
                <div className="gradient-text" style={{
                    fontSize: '8rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    lineHeight: 1,
                    marginBottom: '16px',
                }}>
                    404
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>
                    Page Not Found
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <button className="btn-primary">Go Home</button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
