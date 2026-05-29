export const generateQuestionsPrompt = (resumeText, jobRole) => {
    return `You are an expert technical interviewer. Based on the following resume and job role, generate exactly 10 interview questions.

Job Role: ${jobRole}

Resume:
${resumeText}

Generate a mix of:
- 6 Technical questions (based on skills mentioned in the resume)
- 2 Behavioral questions
- 2 HR questions

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, no extra text):
[
  {
    "question": "Your question here",
    "type": "technical"
  },
  {
    "question": "Your question here",
    "type": "behavioral"
  },
  {
    "question": "Your question here",
    "type": "hr"
  }
]`;
};

export const evaluateAnswerPrompt = (question, answer, jobRole) => {
    return `You are an expert interviewer evaluating a candidate's answer.

Job Role: ${jobRole}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and provide:
1. A score from 0-10
2. Detailed feedback on the answer

Return ONLY a valid JSON object with this exact format (no markdown, no code blocks, no extra text):
{
  "score": 8,
  "feedback": "Your detailed feedback here explaining what was good and what could be improved."
}`;
};

export const generateOverallFeedbackPrompt = (questions, jobRole) => {
    const questionsWithAnswers = questions.map((q, i) => {
        return `Q${i + 1} (${q.type}): ${q.question}\nAnswer: ${q.answer}\nScore: ${q.score}/10\nFeedback: ${q.feedback}`;
    }).join('\n\n');

    return `You are an expert career coach. Based on the following interview performance, provide an overall assessment.

Job Role: ${jobRole}

Interview Performance:
${questionsWithAnswers}

Provide:
1. An overall score (0-100)
2. Overall feedback (2-3 paragraphs)
3. Top 3 strengths
4. Top 3 areas for improvement

Return ONLY a valid JSON object with this exact format (no markdown, no code blocks, no extra text):
{
  "overallScore": 75,
  "overallFeedback": "Your detailed overall feedback here...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
}`;
};
