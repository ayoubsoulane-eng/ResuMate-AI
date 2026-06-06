import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { createCheckoutSession } from '../services/stripe-service.js';

const router = Router();

/**
 * POST /api/payments/create-checkout
 * Create a Stripe checkout session.
 */
router.post('/create-checkout', authenticate, async (req, res) => {
  try {
    const { planType } = req.body;
    if (!planType || !['monthly', 'pay_per_resume'].includes(planType)) {
      return res.status(400).json({ error: 'Valid plan type (monthly or pay_per_resume) is required' });
    }

    const session = await createCheckoutSession(req.user.id, req.user.email, planType);
    res.json({ session });
  } catch (err) {
    console.error('Create checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint (raw body needed, handled in main app).
 */
router.post('/webhook', async (req, res) => {
  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe signature' });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    
    res.json({ received: true, type: event.type });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;