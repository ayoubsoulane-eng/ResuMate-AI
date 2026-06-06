import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All subscription routes require authentication
router.use(authenticate);

/**
 * GET /api/subscriptions/current
 * Get the current user's active subscription.
 */
router.get('/current', (req, res) => {
  try {
    const sub = db.getActiveSubscriptionByUserId(req.user.id);
    if (!sub) {
      return res.json({ subscription: null });
    }
    res.json({ subscription: sub });
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

/**
 * POST /api/subscriptions/create
 * Create a new subscription.
 */
router.post('/create', (req, res) => {
  try {
    const { planType } = req.body;
    if (!planType || !['monthly', 'pay_per_resume'].includes(planType)) {
      return res.status(400).json({ error: 'Valid plan type (monthly or pay_per_resume) is required' });
    }

    // Cancel any existing active subscriptions
    const existing = db.getActiveSubscriptionByUserId(req.user.id);
    if (existing) {
      db.updateSubscriptionStatus(existing.id, 'cancelled');
    }

    const id = db.generateId();
    const startDate = new Date().toISOString();
    let endDate = null;

    if (planType === 'monthly') {
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      endDate = end.toISOString();
    }

    const subscription = db.createSubscription({
      id,
      userId: req.user.id,
      planType,
      status: 'active',
      startDate,
      endDate,
    });

    res.status(201).json({ subscription, message: 'Subscription created successfully' });
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

/**
 * POST /api/subscriptions/cancel
 * Cancel the current user's active subscription.
 */
router.post('/cancel', (req, res) => {
  try {
    const sub = db.getActiveSubscriptionByUserId(req.user.id);
    if (!sub) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    db.updateSubscriptionStatus(sub.id, 'cancelled');
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;