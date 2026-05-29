import express from 'express';
import {
    startInterview,
    submitAnswer,
    completeInterview,
    getInterviewHistory,
    getInterviewById,
} from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import Interview from '../models/Interview.js';
import { sendResultsEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/start', auth, upload.single('resume'), startInterview);
router.post('/answer', auth, submitAnswer);
router.post('/complete', auth, completeInterview);
router.get('/history', auth, getInterviewHistory);
router.get('/:id', auth, getInterviewById);

// Email results
router.post('/:id/email', auth, async (req, res) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
        if (!interview || interview.status !== 'completed') {
            return res.status(400).json({ success: false, message: 'Interview not found or not completed' });
        }

        await sendResultsEmail(req.user.email, req.user.name, interview);
        res.json({ success: true, message: 'Results sent to your email!' });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ success: false, message: 'Failed to send email. Check email configuration.' });
    }
});

export default router;

