import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateResume, generateCoverLetter, analyzeResumeFit } from '../services/ai-service.js';
import db from '../db.js';

const router = Router();

router.use(authenticate);

/**
 * POST /api/ai/generate-resume
 * Generate an ATS-optimized resume from user data and job description.
 */
router.post('/generate-resume', async (req, res) => {
  try {
    const { userData, jobDescription, options } = req.body;
    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const resume = await generateResume(userData, jobDescription, options);

    // Save the generated resume to the user's account
    const id = db.generateId();
    const title = `ATS-Optimized Resume - ${new Date().toLocaleDateString()}`;
    const saved = db.createResume({
      id,
      userId: req.user.id,
      title,
      content: JSON.stringify(resume),
      jobDescription: jobDescription || '',
    });

    res.json({ resume: saved, generatedContent: resume });
  } catch (err) {
    console.error('AI generate resume error:', err);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

/**
 * POST /api/ai/generate-cover-letter
 * Generate a tailored cover letter.
 */
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { userData, jobDescription, companyInfo } = req.body;
    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const coverLetter = await generateCoverLetter(userData, jobDescription, companyInfo);
    res.json({ coverLetter });
  } catch (err) {
    console.error('AI generate cover letter error:', err);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

/**
 * POST /api/ai/analyze
 * Analyze resume fit against a job description.
 */
router.post('/analyze', async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ error: 'Resume content and job description are required' });
    }

    const analysis = await analyzeResumeFit(resumeContent, jobDescription);
    res.json({ analysis });
  } catch (err) {
    console.error('AI analyze error:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

export default router;