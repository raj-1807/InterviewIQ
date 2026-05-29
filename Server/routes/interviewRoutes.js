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

const router = express.Router();

router.post('/start', auth, upload.single('resume'), startInterview);
router.post('/answer', auth, submitAnswer);
router.post('/complete', auth, completeInterview);
router.get('/history', auth, getInterviewHistory);
router.get('/:id', auth, getInterviewById);

export default router;
