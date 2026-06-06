import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All resume routes require authentication
router.use(authenticate);

/**
 * GET /api/resumes
 * List all resumes for the current user.
 */
router.get('/', (req, res) => {
  try {
    const resumes = db.getResumesByUserId(req.user.id);
    res.json({ resumes });
  } catch (err) {
    console.error('List resumes error:', err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

/**
 * GET /api/resumes/:id
 * Get a single resume by ID.
 */
router.get('/:id', (req, res) => {
  try {
    const resume = db.getResumeById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ resume });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

/**
 * POST /api/resumes
 * Create a new resume.
 */
router.post('/', (req, res) => {
  try {
    const { title, content, jobDescription } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const id = db.generateId();
    const resume = db.createResume({
      id,
      userId: req.user.id,
      title,
      content: typeof content === 'string' ? content : JSON.stringify(content),
      jobDescription,
    });

    res.status(201).json({ resume, message: 'Resume created successfully' });
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

/**
 * PUT /api/resumes/:id
 * Update an existing resume.
 */
router.put('/:id', (req, res) => {
  try {
    const resume = db.getResumeById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, content, jobDescription } = req.body;
    const updated = db.updateResume(req.params.id, {
      title,
      content: content ? (typeof content === 'string' ? content : JSON.stringify(content)) : undefined,
      jobDescription,
    });

    res.json({ resume: updated, message: 'Resume updated successfully' });
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

/**
 * DELETE /api/resumes/:id
 * Delete a resume.
 */
router.delete('/:id', (req, res) => {
  try {
    const resume = db.getResumeById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.deleteResume(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;