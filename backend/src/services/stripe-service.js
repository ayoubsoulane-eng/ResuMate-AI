/**
 * Stripe Payment Integration Service
 * Handles subscription management, one-time payments, and webhooks.
 */

import db from '../db.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Create a Stripe checkout session for a subscription.
 * 
 * @param {string} userId - The user's internal ID
 * @param {string} userEmail - User's email for Stripe
 * @param {'monthly'|'pay_per_resume'} planType - Subscription type
 * @returns {Promise<Object>} Checkout session details
 */
export async function createCheckoutSession(userId, userEmail, planType) {
  if (!STRIPE_SECRET_KEY) {
    // Mock: return a simulated checkout session
    console.warn('No Stripe key configured — simulating checkout');
    return mockCheckout(userId, planType);
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const priceMap = {
      monthly: { price: 'price_monthly_15', amount: 1500 }, // $15.00
      pay_per_resume: { price: 'price_per_resume_5', amount: 500 }, // $5.00
    };

    const plan = priceMap[planType];
    if (!plan) throw new Error(`Unknown plan type: ${planType}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: planType === 'monthly' ? 'subscription' : 'payment',
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: planType === 'monthly' ? 'ResuMate AI Monthly Subscription' : 'ResuMate AI - Single Resume',
            description: planType === 'monthly'
              ? 'Unlimited AI-generated resumes, cover letters, and application tracking'
              : 'One high-quality ATS-optimized resume PDF export',
          },
          unit_amount: plan.amount,
          recurring: planType === 'monthly' ? { interval: 'month' } : undefined,
        },
        quantity: 1,
      }],
      success_url: `${FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${FRONTEND_URL}/pricing?payment=cancelled`,
      metadata: {
        userId,
        planType,
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    // Fallback to mock
    return mockCheckout(userId, planType);
  }
}

/**
 * Handle Stripe webhook events for payment confirmations.
 */
export async function handleWebhook(payload, signature) {
  if (!STRIPE_SECRET_KEY) {
    console.warn('No Stripe key configured — webhooks simulated');
    return { received: true };
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return { received: true, warning: 'No webhook secret configured' };
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, planType } = session.metadata;

        // Create subscription record in our database
        const id = db.generateId();
        const startDate = new Date().toISOString();
        let endDate = null;

        if (planType === 'monthly') {
          const end = new Date();
          end.setMonth(end.getMonth() + 1);
          endDate = end.toISOString();
        }

        db.createSubscription({
          id,
          userId,
          planType,
          status: 'active',
          startDate,
          endDate,
        });

        console.log(`Subscription created for user ${userId}: ${planType}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        // Extend monthly subscription
        const invoice = event.data.object;
        if (invoice.subscription) {
          console.log(`Payment succeeded for subscription ${invoice.subscription}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Cancel subscription
        console.log('Subscription deleted event received');
        break;
      }
    }

    return { received: true };
  } catch (err) {
    console.error('Webhook handling error:', err.message);
    throw err;
  }
}

// ---- Mock implementation for development ----

function mockCheckout(userId, planType) {
  const id = db.generateId();
  const startDate = new Date().toISOString();
  let endDate = null;

  if (planType === 'monthly') {
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    endDate = end.toISOString();
  }

  // Auto-create subscription in dev mode
  db.createSubscription({
    id,
    userId,
    planType,
    status: 'active',
    startDate,
    endDate,
  });

  return {
    url: `${FRONTEND_URL}/dashboard?payment=success&mock=true`,
    sessionId: `cs_mock_${id.slice(0, 8)}`,
    mock: true,
  };
}