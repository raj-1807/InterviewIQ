import Interview from '../models/Interview.js';
import User from '../models/User.js';
import model from '../config/gemini.js';
import extractPdfText from '../utils/extractPdfText.js';
import {
    generateQuestionsPrompt,
    evaluateAnswerPrompt,
    generateOverallFeedbackPrompt,
} from '../utils/aiPrompts.js';

// Helper: parse AI response (strip markdown code blocks if present)
const parseAIResponse = (text) => {
    let cleaned = text.trim();
    // Remove markdown code block wrappers
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    return JSON.parse(cleaned);
};

// @desc    Start a new interview — upload resume + get AI questions
// @route   POST /api/interview/start
export const startInterview = async (req, res) => {
    try {
        const { jobRole } = req.body;
        const userId = req.user._id;

        if (!jobRole) {
            return res.status(400).json({ success: false, message: 'Job role is required' });
        }

        // Check credits
        const user = await User.findById(userId);
        if (user.credits <= 0) {
            return res.status(403).json({ success: false, message: 'Insufficient credits. Please purchase more.' });
        }

        // Extract resume text from uploaded PDF
        let resumeText = '';
        if (req.file) {
            resumeText = await extractPdfText(req.file.buffer);
        }

        // Generate questions using Gemini AI
        const prompt = generateQuestionsPrompt(resumeText || 'No resume provided', jobRole);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let questions;
        try {
            questions = parseAIResponse(responseText);
        } catch (parseError) {
            console.error('AI response parse error:', parseError);
            return res.status(500).json({ success: false, message: 'Failed to generate questions. Please try again.' });
        }

        // Create interview
        const interview = await Interview.create({
            userId,
            resumeText,
            jobRole,
            questions: questions.map(q => ({
                question: q.question,
                type: q.type,
                answer: '',
                feedback: '',
                score: 0,
            })),
            totalQuestions: questions.length,
            currentQuestion: 0,
            status: 'in_progress',
        });

        // Deduct 1 credit
        user.credits -= 1;
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Interview started',
            interview: {
                _id: interview._id,
                jobRole: interview.jobRole,
                questions: interview.questions.map(q => ({
                    _id: q._id,
                    question: q.question,
                    type: q.type,
                })),
                totalQuestions: interview.totalQuestions,
                currentQuestion: interview.currentQuestion,
                status: interview.status,
            },
            remainingCredits: user.credits,
        });
    } catch (error) {
        console.error('Start interview error:', error);
        return res.status(500).json({ success: false, message: 'Failed to start interview' });
    }
};

// @desc    Submit answer for a question
// @route   POST /api/interview/answer
export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionId, answer } = req.body;

        if (!interviewId || !questionId || !answer) {
            return res.status(400).json({ success: false, message: 'Interview ID, question ID, and answer are required' });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            userId: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        if (interview.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Interview is already completed' });
        }

        // Find the question
        const question = interview.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        // Evaluate answer using Gemini AI
        const prompt = evaluateAnswerPrompt(question.question, answer, interview.jobRole);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let evaluation;
        try {
            evaluation = parseAIResponse(responseText);
        } catch (parseError) {
            console.error('AI evaluation parse error:', parseError);
            evaluation = { score: 5, feedback: 'Unable to evaluate. Please try again.' };
        }

        // Update the question
        question.answer = answer;
        question.feedback = evaluation.feedback;
        question.score = Math.min(10, Math.max(0, evaluation.score));

        // Update current question index
        interview.currentQuestion = Math.min(
            interview.currentQuestion + 1,
            interview.totalQuestions
        );

        await interview.save();

        return res.status(200).json({
            success: true,
            message: 'Answer submitted',
            evaluation: {
                score: question.score,
                feedback: question.feedback,
            },
            currentQuestion: interview.currentQuestion,
            totalQuestions: interview.totalQuestions,
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        return res.status(500).json({ success: false, message: 'Failed to submit answer' });
    }
};

// @desc    Complete interview and get overall feedback
// @route   POST /api/interview/complete
export const completeInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;

        const interview = await Interview.findOne({
            _id: interviewId,
            userId: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        if (interview.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Interview is already completed' });
        }

        // Generate overall feedback using Gemini AI
        const prompt = generateOverallFeedbackPrompt(interview.questions, interview.jobRole);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let overallResult;
        try {
            overallResult = parseAIResponse(responseText);
        } catch (parseError) {
            console.error('AI overall feedback parse error:', parseError);
            // Fallback: calculate from individual scores
            const avgScore = interview.questions.reduce((sum, q) => sum + q.score, 0) / interview.questions.length;
            overallResult = {
                overallScore: Math.round(avgScore * 10),
                overallFeedback: 'Interview completed. Review individual question feedback for details.',
                strengths: ['Completed the interview'],
                improvements: ['Try to provide more detailed answers'],
            };
        }

        interview.overallFeedback = overallResult.overallFeedback;
        interview.overallScore = Math.min(100, Math.max(0, overallResult.overallScore));
        interview.strengths = overallResult.strengths || [];
        interview.improvements = overallResult.improvements || [];
        interview.status = 'completed';

        await interview.save();

        return res.status(200).json({
            success: true,
            message: 'Interview completed',
            interview,
        });
    } catch (error) {
        console.error('Complete interview error:', error);
        return res.status(500).json({ success: false, message: 'Failed to complete interview' });
    }
};

// @desc    Get interview history
// @route   GET /api/interview/history
export const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('jobRole overallScore status createdAt totalQuestions');

        return res.status(200).json({
            success: true,
            interviews,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single interview details
// @route   GET /api/interview/:id
export const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        return res.status(200).json({
            success: true,
            interview,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
