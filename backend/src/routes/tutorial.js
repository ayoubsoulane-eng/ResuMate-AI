import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTutorialResponse } from '../services/tutorial-service.js';

const router = Router();

router.use(authenticate);

/**
 * POST /api/tutorial/chat
 * 
 * Context-aware AI tutorial assistant for the resume builder.
 * Knows which step the user is on and provides tailored guidance.
 * 
 * Request body:
 *   step: number (1-4) — current builder step
 *   userInput: string — what the user typed
 *   history: array — previous conversation [{role, content}]
 * 
 * Response:
 *   response: string — AI guidance text
 *   tips: string[] — optional fallback tips
 *   step: number — current step context
 */
router.post('/chat', async (req, res) => {
  try {
    const { step = 1, userInput = '', history = [] } = req.body;

    // Validate step
    const stepNum = parseInt(step);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 4) {
      return res.status(400).json({
        error: 'Step must be between 1 and 4',
        stepLabels: {
          1: 'Personal Info',
          2: 'Experience',
          3: 'Education',
          4: 'Skills',
        },
      });
    }

    const result = await getTutorialResponse({ step: stepNum, userInput, history });

    res.json({
      ...result,
      step: stepNum,
      stepName: ['Personal Info', 'Experience', 'Education', 'Skills'][stepNum - 1],
    });
  } catch (err) {
    console.error('Tutorial chat error:', err);
    res.status(500).json({ error: 'Failed to get tutorial response' });
  }
});

/**
 * GET /api/tutorial/step/:step
 * Get quick tips for a specific step without needing a chat.
 */
router.get('/step/:step', (req, res) => {
  const stepNum = parseInt(req.params.step);
  if (isNaN(stepNum) || stepNum < 1 || stepNum > 4) {
    return res.status(400).json({ error: 'Step must be between 1 and 4' });
  }

  const stepTips = {
    1: {
      name: 'Personal Info',
      tips: [
        'Use a professional email (firstname.lastname@domain.com)',
        'Customize your LinkedIn URL',
        'Write a 2-3 sentence professional summary',
        'Include portfolio/GitHub if relevant',
      ],
    },
    2: {
      name: 'Experience',
      tips: [
        'Use the STAR method: Situation, Task, Action, Result',
        'Start bullets with strong action verbs',
        'Quantify achievements with numbers',
        'Tailor bullets to the job description',
      ],
    },
    3: {
      name: 'Education',
      tips: [
        'List: Degree, Institution, Graduation Year',
        'Add GPA only if 3.5+',
        'Include relevant coursework',
        'Add certifications and online courses',
      ],
    },
    4: {
      name: 'Skills',
      tips: [
        'Group by category: Languages, Frameworks, Tools',
        'Match keywords from the job description',
        'Remove outdated skills',
        'List 8-12 most relevant skills',
      ],
    },
  };

  res.json({ step: stepNum, ...stepTips[stepNum] });
});

export default router;