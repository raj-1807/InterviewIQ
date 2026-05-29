import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import PricingPage from './pages/PricingPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1a1a3e',
                        color: '#f1f5f9',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#1a1a3e' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#1a1a3e' },
                    },
                }}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pricing" element={<PricingPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/interview/:id" element={
                    <ProtectedRoute><Interview /></ProtectedRoute>
                } />
                <Route path="/results/:id" element={
                    <ProtectedRoute><Results /></ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
