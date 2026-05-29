import express from 'express';
import {
    createOrder,
    verifyPayment,
    getPaymentHistory,
    getPackages,
} from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/history', auth, getPaymentHistory);
router.get('/packages', getPackages);

export default router;
