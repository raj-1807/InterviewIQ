import pdf from 'pdf-parse/lib/pdf-parse.js';

const extractPdfText = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF extraction error:', error.message);
        throw new Error('Failed to extract text from PDF');
    }
};

export default extractPdfText;
