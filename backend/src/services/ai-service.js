/**
 * AI Resume Generation Service
 * 
 * Interfaces with OpenAI (and/or Anthropic) to generate ATS-optimized
 * resumes and tailored cover letters based on user experience and job descriptions.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Resume section structure expected by the AI.
 */
const RESUME_SECTIONS = [
  'contact',      // name, email, phone, linkedin, portfolio
  'summary',      // professional summary / objective
  'experience',   // work history with bullet points
  'education',    // degrees, certifications
  'skills',       // technical and soft skills
  'projects',     // notable projects
];

/**
 * Generate a complete ATS-optimized resume from user experience data and a job description.
 * 
 * @param {Object} userData - User's resume input data
 * @param {string} userData.contactInfo - JSON string with contact details
 * @param {string} userData.experience - Work experience description
 * @param {string} userData.education - Education details
 * @param {string} userData.skills - Skills list
 * @param {string} userData.projects - Projects description
 * @param {string} jobDescription - The target job description for tailoring
 * @param {Object} options - Generation options
 * @param {string} options.tone - 'professional' | 'modern' | 'academic'
 * @returns {Promise<Object>} Structured resume data
 */
export async function generateResume(userData, jobDescription, options = {}) {
  const tone = options.tone || 'professional';

  // If no API key, fall back to template-based generation
  if (!OPENAI_API_KEY) {
    console.warn('No OpenAI API key configured — using template-based resume generation');
    return generateTemplateResume(userData, jobDescription, tone);
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const systemPrompt = `You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist. Your job is to:
1. Analyze the candidate's experience and the job description
2. Rewrite experience bullet points to be achievement-oriented and ATS-friendly
3. Incorporate relevant keywords from the job description naturally
4. Format output as structured JSON with these sections: contact, summary, experience[], education[], skills[], projects[]
5. Ensure each experience entry has: title, company, location, dates, bullets[]
6. Output ONLY valid JSON, no markdown formatting`;

    const userPrompt = `Generate an ATS-optimized resume with a ${tone} tone.

Candidate Data:
- Contact Info: ${userData.contactInfo || 'Not provided'}
- Experience: ${userData.experience || 'Not provided'}
- Education: ${userData.education || 'Not provided'}
- Skills: ${userData.skills || 'Not provided'}
- Projects: ${userData.projects || 'Not provided'}

Target Job Description:
${jobDescription || 'Not provided — generate a general-purpose resume'}

Respond with ONLY valid JSON matching this schema:
{
  "contact": { "name": "", "email": "", "phone": "", "linkedin": "", "portfolio": "" },
  "summary": "2-3 sentence professional summary optimized for the target role",
  "experience": [{ "title": "", "company": "", "location": "", "dates": "", "bullets": ["achievement-oriented bullet 1", "bullet 2"] }],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "skills": ["skill1", "skill2"],
  "projects": [{ "name": "", "description": "", "technologies": "" }]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    return JSON.parse(content);
  } catch (err) {
    console.error('AI generation error:', err.message);
    // Fallback to template generation
    return generateTemplateResume(userData, jobDescription, tone);
  }
}

/**
 * Generate a cover letter tailored to a job description.
 * 
 * @param {Object} userData - User info (name, experience highlights)
 * @param {string} jobDescription - The job posting
 * @param {Object} companyInfo - Company name, hiring manager, etc.
 * @returns {Promise<string>} Cover letter text
 */
export async function generateCoverLetter(userData, jobDescription, companyInfo = {}) {
  if (!OPENAI_API_KEY) {
    return generateTemplateCoverLetter(userData, jobDescription, companyInfo);
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert cover letter writer. Write compelling, personalized cover letters that highlight the candidate\'s relevant experience for the specific role. Keep it to 3-4 paragraphs. Do not use markdown.',
        },
        {
          role: 'user',
          content: `Write a cover letter for:
Candidate: ${userData.name || 'Candidate'}
Key Experience: ${userData.experience || 'Not provided'}
Target Company: ${companyInfo.name || 'Company'}
Hiring Manager: ${companyInfo.hiringManager || 'Hiring Manager'}
Job Description: ${jobDescription || 'Not provided'}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (err) {
    console.error('Cover letter generation error:', err.message);
    return generateTemplateCoverLetter(userData, jobDescription, companyInfo);
  }
}

/**
 * Analyze a resume against a job description and provide ATS score / improvement suggestions.
 */
export async function analyzeResumeFit(resumeContent, jobDescription) {
  if (!OPENAI_API_KEY) {
    return {
      score: 75,
      missingKeywords: [],
      suggestions: ['Connect an OpenAI API key for detailed ATS analysis'],
    };
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an ATS optimization expert. Analyze the resume against the job description and return a JSON object with: score (0-100), missingKeywords (array), suggestions (array of improvement tips).',
        },
        {
          role: 'user',
          content: `Resume: ${resumeContent}\n\nJob Description: ${jobDescription}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0]?.message?.content || '{}');
  } catch (err) {
    console.error('ATS analysis error:', err.message);
    return { score: 50, missingKeywords: [], suggestions: ['Analysis unavailable — check API configuration'] };
  }
}

// ---- Template-based fallback generators (no API key needed) ----

function generateTemplateResume(userData, jobDescription, tone) {
  const contact = tryParseJSON(userData.contactInfo);
  const skills = userData.skills ? userData.skills.split(',').map(s => s.trim()) : ['Communication', 'Problem Solving'];

  return {
    contact: {
      name: contact?.name || 'Your Name',
      email: contact?.email || 'email@example.com',
      phone: contact?.phone || '(555) 123-4567',
      linkedin: contact?.linkedin || 'linkedin.com/in/yourprofile',
      portfolio: contact?.portfolio || '',
    },
    summary: `Experienced professional with a proven track record in delivering results. ${
      jobDescription ? `Seeking to leverage expertise in a ${jobDescription.split('\n')[0]?.substring(0, 100) || 'challenging'} role.` : 'Dedicated to driving organizational success through innovative solutions.'
    }`,
    experience: [
      {
        title: 'Senior Professional',
        company: 'Current Company',
        location: 'City, State',
        dates: '2020 - Present',
        bullets: [
          'Led cross-functional teams to achieve 25% increase in efficiency',
          'Implemented new processes resulting in $500K annual savings',
          'Mentored junior team members and improved team productivity by 15%',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'University Name',
        year: '2016',
      },
    ],
    skills: skills,
    projects: [
      {
        name: 'Key Project',
        description: 'Successfully delivered a major initiative that drove business growth.',
        technologies: skills.slice(0, 3).join(', '),
      },
    ],
  };
}

function generateTemplateCoverLetter(userData, jobDescription, companyInfo) {
  const name = userData.name || 'Candidate';
  const company = companyInfo.name || 'the Company';
  return `Dear ${companyInfo.hiringManager || 'Hiring Manager'},

I am writing to express my strong interest in the position at ${company}. With my background and skills, I am confident that I would be a valuable addition to your team.

${userData.experience ? `My experience includes ${userData.experience.substring(0, 200)}.` : 'I bring a strong work ethic and a commitment to excellence in every role I undertake.'}

I am particularly drawn to this opportunity because it aligns with my career goals and offers a chance to contribute to ${company}'s continued success. I am excited about the possibility of bringing my unique perspective and skills to your organization.

Thank you for considering my application. I look forward to discussing how I can contribute to ${company}.

Best regards,
${name}`;
}

function tryParseJSON(str) {
  if (!str || typeof str !== 'string') return null;
  try { return JSON.parse(str); } catch { return null; }
}