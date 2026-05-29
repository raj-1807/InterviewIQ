import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '48px 0 24px',
        }}>
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--gradient-primary)' }}>
                                <HiOutlineSparkles className="text-white text-sm" />
                            </div>
                            <span className="text-lg font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                                InterviewIQ
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '320px' }}>
                            AI-powered interview preparation platform. Upload your resume, practice with AI-generated questions, and ace your next interview.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Product</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/pricing" className="no-underline text-sm" style={{ color: 'var(--text-muted)' }}>Pricing</Link>
                            <Link to="/dashboard" className="no-underline text-sm" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Support</h4>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="no-underline text-sm" style={{ color: 'var(--text-muted)' }}>Help Center</a>
                            <a href="#" className="no-underline text-sm" style={{ color: 'var(--text-muted)' }}>Contact Us</a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '24px',
                    textAlign: 'center',
                }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} InterviewIQ. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
