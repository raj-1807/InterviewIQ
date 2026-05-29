import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['technical', 'hr', 'behavioral'],
        default: 'technical',
    },
    answer: {
        type: String,
        default: '',
    },
    feedback: {
        type: String,
        default: '',
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
});

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resumeText: {
        type: String,
        default: '',
    },
    jobRole: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [questionSchema],
    overallFeedback: {
        type: String,
        default: '',
    },
    overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    strengths: [{
        type: String,
    }],
    improvements: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress',
    },
    totalQuestions: {
        type: Number,
        default: 10,
    },
    currentQuestion: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
