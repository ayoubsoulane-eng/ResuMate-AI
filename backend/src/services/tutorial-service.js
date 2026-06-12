/**
 * AI Tutorial Assistant Service — "AI in the corner"
 * 
 * Provides context-aware, step-by-step guidance as users build their resume.
 * Knows which step of the builder the user is on and adjusts advice accordingly.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Context-aware system prompts for each resume building step.
 * Each prompt is tailored to guide the user through that specific section.
 */
const STEP_SYSTEM_PROMPTS = {
  1: `You are a friendly, encouraging resume coach helping a user fill out the "Personal Info" section of their resume.

Your role:
- Help them craft a compelling professional summary/objective (2-3 sentences)
- Advise on what to include in contact info (email, phone, LinkedIn, portfolio)
- Offer tips on professional email address format and LinkedIn URL optimization
- Keep the tone warm, supportive, and actionable
- If they've written something, give specific feedback on how to improve it

Examples of guidance:
- "A strong summary bridges your experience to the role you want. Try starting with your years of experience and key expertise, then mention what you're looking for next."
- "Make sure your LinkedIn URL is customized (linkedin.com/in/yourname) — it looks more professional."`,

  2: `You are a friendly, encouraging resume coach helping a user fill out the "Experience" section of their resume.

Your role:
- Guide them on writing achievement-oriented bullet points (not just responsibilities)
- Recommend the STAR method (Situation, Task, Action, Result) for each bullet
- Encourage quantifying achievements with numbers, percentages, and dollar amounts
- Help them tailor experience to match job descriptions
- Suggest strong action verbs to start each bullet point
- Keep the tone warm, supportive, and actionable
- If they've written something, give specific feedback on how to improve it

Examples of guidance:
- "Instead of 'Responsible for the team,' try 'Led a cross-functional team of 5 engineers to deliver a platform redesign, resulting in 30% faster load times.'"
- "Action verbs like 'Spearheaded,' 'Optimized,' 'Architected,' and 'Accelerated' grab recruiters' attention."
- "Quantify your impact! 'Improved efficiency by 25%' is much more powerful than 'Improved efficiency.'"`,

  3: `You are a friendly, encouraging resume coach helping a user fill out the "Education" section of their resume.

Your role:
- Help them format their education entries (degree, institution, graduation year)
- Advise on whether to include GPA (generally only if 3.5+ or if requested)
- Suggest including relevant coursework, honors, or extracurriculars for recent grads
- Offer tips on listing certifications and online courses (Coursera, Udemy, etc.)
- Keep the tone warm, supportive, and actionable
- If they've written something, give specific feedback on how to improve it

Examples of guidance:
- "For each degree, list: Degree Name, Institution Name, Graduation Year. You can add relevant coursework on the same line."
- "If you're a recent grad, consider adding your GPA if it's 3.5 or higher, and any academic honors like 'Dean's List.'"`,

  4: `You are a friendly, encouraging resume coach helping a user fill out the "Skills" section of their resume.

Your role:
- Help them organize skills into categories (Languages, Frameworks, Tools, Soft Skills)
- Advise on tailoring skills to match the job description keywords
- Suggest removing outdated or irrelevant skills
- Recommend prioritizing skills mentioned in the target job posting
- Keep the tone warm, supportive, and actionable
- If they've written something, give specific feedback on how to improve it

Examples of guidance:
- "Group your skills by category: Programming Languages, Frameworks & Libraries, Tools & Platforms, and Soft Skills. This makes them easier for ATS systems to parse."
- "Look at the job description you're targeting — which skills appear multiple times? Make sure those are front and center in your skills section."`,
};

/**
 * Fallback guidance when OpenAI is unavailable.
 */
const STEP_FALLBACK_TIPS = {
  1: [
    "💡 A strong professional summary should be 2-3 sentences that highlight your years of experience, key skills, and what you're looking for next.",
    "📧 Use a professional email address — ideally firstname.lastname@email.com. Avoid nicknames or numbers.",
    "🔗 Customize your LinkedIn URL to match your name — it looks more polished on your resume.",
  ],
  2: [
    "📊 Use the STAR method for each bullet: Situation, Task, Action, Result. Quantify your impact with numbers!",
    "⚡ Start bullets with strong action verbs: Spearheaded, Optimized, Architected, Led, Accelerated, Designed.",
    "🎯 Tailor your experience bullets to match keywords from the job description you're targeting.",
  ],
  3: [
    "🎓 List: Degree Name, Institution, Graduation Year. Add relevant coursework for recent grads.",
    "🏆 Include GPA only if 3.5+ or specifically requested. Honors like 'Magna Cum Laude' are worth adding.",
    "📜 Certifications (AWS, Google, PMP) go great here too — especially if they're relevant to the role.",
  ],
  4: [
    "📋 Group skills by category: Languages, Frameworks, Tools, Soft Skills. ATS systems parse this better.",
    "🎯 Scan the job description and prioritize keywords that appear most frequently.",
    "🧹 Remove outdated skills (e.g., jQuery if you know React, or IE compatibility skills).",
  ],
};

/**
 * POST /api/tutorial/chat
 * 
 * @param {Object} body
 * @param {number} body.step - Current builder step (1-4)
 * @param {string} body.userInput - What the user has typed/written
 * @param {Array} body.history - Previous conversation messages [{role, content}]
 * @returns {Promise<Object>} { response: string, tips?: string[] }
 */
export async function getTutorialResponse({ step = 1, userInput = '', history = [] }) {
  const stepNum = parseInt(step) || 1;
  const clampedStep = Math.min(4, Math.max(1, stepNum));

  // If OpenAI key is available, use real AI
  if (OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const systemPrompt = STEP_SYSTEM_PROMPTS[clampedStep] || STEP_SYSTEM_PROMPTS[1];

      const messages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).slice(-10), // Keep last 10 messages for context
      ];

      // Add the current user input if provided
      if (userInput?.trim()) {
        messages.push({ role: 'user', content: userInput });
      } else {
        // If no input, ask a leading question based on the step
        const leadingQuestions = {
          1: 'What kind of professional summary are you thinking of writing? Tell me about your background!',
          2: 'What was your most recent role? Tell me about your responsibilities and achievements there!',
          3: 'What education do you have? Tell me about your degrees, schools, and any certifications!',
          4: 'What technical skills and tools do you work with? List them out and I\'ll help organize them!',
        };
        messages.push({ role: 'user', content: leadingQuestions[clampedStep] || 'How can I help you with your resume?' });
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      return {
        response: content || getFallbackTip(clampedStep),
        tips: null,
        model: 'openai',
      };
    } catch (err) {
      console.error('Tutorial AI error:', err.message);
      return getFallbackResponse(clampedStep);
    }
  }

  // Fallback when no API key
  return getFallbackResponse(clampedStep);
}

function getFallbackResponse(step) {
  const tips = STEP_FALLBACK_TIPS[step] || STEP_FALLBACK_TIPS[1];
  return {
    response: tips[Math.floor(Math.random() * tips.length)],
    tips,
    model: 'fallback',
  };
}

function getFallbackTip(step) {
  const tips = STEP_FALLBACK_TIPS[step] || STEP_FALLBACK_TIPS[1];
  return tips[Math.floor(Math.random() * tips.length)];
}