import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

// Credit packages
const CREDIT_PACKAGES = {
    basic: { credits: 10, amount: 9900, name: 'Basic Pack' },       // ₹99
    standard: { credits: 25, amount: 19900, name: 'Standard Pack' }, // ₹199
    premium: { credits: 60, amount: 39900, name: 'Premium Pack' },   // ₹399
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
export const createOrder = async (req, res) => {
    try {
        const { packageId } = req.body;

        const creditPackage = CREDIT_PACKAGES[packageId];
        if (!creditPackage) {
            return res.status(400).json({ success: false, message: 'Invalid package' });
        }

        const options = {
            amount: creditPackage.amount, // amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                credits: creditPackage.credits,
                packageName: creditPackage.name,
            },
        };

        const order = await razorpayInstance.orders.create(options);

        // Save payment record
        await Payment.create({
            userId: req.user._id,
            orderId: order.id,
            amount: creditPackage.amount,
            credits: creditPackage.credits,
            status: 'created',
        });

        return res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create order' });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        // Update payment record
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;
        payment.status = 'paid';
        await payment.save();

        // Add credits to user
        const user = await User.findById(payment.userId);
        user.credits += payment.credits;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `${payment.credits} credits added successfully!`,
            credits: user.credits,
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        return res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// @desc    Get payment history
// @route   GET /api/payment/history
export const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            payments,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get available credit packages
// @route   GET /api/payment/packages
export const getPackages = async (req, res) => {
    return res.status(200).json({
        success: true,
        packages: Object.entries(CREDIT_PACKAGES).map(([id, pkg]) => ({
            id,
            ...pkg,
            displayAmount: `₹${pkg.amount / 100}`,
        })),
    });
};
