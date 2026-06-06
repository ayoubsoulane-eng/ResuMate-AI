import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateResumePDF, generateFullApplicationPDF, TEMPLATES } from '../services/pdf-service.js';
import db from '../db.js';

const router = Router();

router.use(authenticate);

/**
 * GET /api/pdf/templates
 * List available PDF templates.
 */
router.get('/templates', (req, res) => {
  res.json({ templates: TEMPLATES });
});

/**
 * POST /api/pdf/export-resume
 * Export a resume as PDF.
 */
router.post('/export-resume', async (req, res) => {
  try {
    const { resumeId, template } = req.body;
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    const resume = db.getResumeById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resumeData = typeof resume.content === 'string' ? JSON.parse(resume.content) : resume.content;
    const templateKey = TEMPLATES[template] ? template : 'modern';
    
    const pdfBuffer = await generateResumePDF(resumeData, templateKey);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${resume.id.slice(0, 8)}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

/**
 * POST /api/pdf/export-full
 * Export resume + cover letter as a single PDF.
 */
router.post('/export-full', async (req, res) => {
  try {
    const { resumeId, coverLetter, template } = req.body;
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    const resume = db.getResumeById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resumeData = typeof resume.content === 'string' ? JSON.parse(resume.content) : resume.content;
    const templateKey = TEMPLATES[template] ? template : 'modern';
    
    const pdfBuffer = await generateFullApplicationPDF(resumeData, coverLetter || '', templateKey);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="application-${resume.id.slice(0, 8)}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Full PDF export error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;