/**
 * PDF Export Service for ResuMate AI
 * Generates high-quality PDF resumes with professional template options.
 * Uses Puppeteer to render HTML templates to PDF.
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

const TEMPLATES_DIR = new URL('../templates', import.meta.url).pathname;

/**
 * Available resume template styles.
 */
export const TEMPLATES = {
  modern: {
    name: 'Modern',
    description: 'Clean, contemporary design with a sidebar for skills',
    primaryColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
  },
  professional: {
    name: 'Professional',
    description: 'Traditional two-column layout optimized for ATS',
    primaryColor: '#1e293b',
    fontFamily: 'Georgia, serif',
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Simple, elegant single-column design',
    primaryColor: '#0f172a',
    fontFamily: 'system-ui, sans-serif',
  },
};

/**
 * Generate a PDF resume from structured resume data.
 * 
 * @param {Object} resumeData - The structured resume content
 * @param {string} template - Template name: 'modern', 'professional', 'minimalist'
 * @param {Object} options
 * @param {boolean} options.includeCoverLetter - Whether to append cover letter
 * @returns {Promise<Buffer>} PDF file buffer
 */
export async function generateResumePDF(resumeData, template = 'modern', options = {}) {
  const html = renderResumeHTML(resumeData, template);
  return renderPDF(html, {
    format: 'A4',
    margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
  });
}

/**
 * Generate a PDF with both resume and cover letter.
 */
export async function generateFullApplicationPDF(resumeData, coverLetter, template = 'modern') {
  const resumeHTML = renderResumeHTML(resumeData, template);
  const coverHTML = renderCoverLetterHTML(coverLetter, template);
  const combinedHTML = resumeHTML + `<div style="page-break-before: always;">${coverHTML}</div>`;
  
  return renderPDF(combinedHTML, {
    format: 'A4',
    margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
  });
}

// ---- HTML Rendering ----

function renderResumeHTML(data, templateKey) {
  const tmpl = TEMPLATES[templateKey] || TEMPLATES.modern;
  const { contact, summary, experience, education, skills, projects } = data;
  
  const experienceHTML = (experience || []).map(exp => `
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <div class="exp-title">${escapeHTML(exp.title)}</div>
          <div class="exp-company">${escapeHTML(exp.company)}${exp.location ? ` &mdash; ${escapeHTML(exp.location)}` : ''}</div>
        </div>
        <div class="exp-dates">${escapeHTML(exp.dates || '')}</div>
      </div>
      <ul class="exp-bullets">
        ${(exp.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('\n        ')}
      </ul>
    </div>
  `).join('\n    ');

  const educationHTML = (education || []).map(edu => `
    <div class="edu-item">
      <div class="edu-degree">${escapeHTML(edu.degree)}</div>
      <div class="edu-school">${escapeHTML(edu.institution)}${edu.year ? ` &middot; ${escapeHTML(edu.year)}` : ''}</div>
    </div>
  `).join('\n    ');

  const skillsHTML = (skills || []).map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('\n      ');

  const projectsHTML = (projects || []).map(proj => `
    <div class="project-item">
      <div class="project-name">${escapeHTML(proj.name)}</div>
      <div class="project-desc">${escapeHTML(proj.description)}</div>
      ${proj.technologies ? `<div class="project-tech">${escapeHTML(proj.technologies)}</div>` : ''}
    </div>
  `).join('\n    ');

  const sidebarTemplate = templateKey === 'modern' ? `
    <div class="sidebar">
      <div class="sidebar-section">
        <h3>Contact</h3>
        <div class="contact-info">
          ${contact?.email ? `<div>${escapeHTML(contact.email)}</div>` : ''}
          ${contact?.phone ? `<div>${escapeHTML(contact.phone)}</div>` : ''}
          ${contact?.linkedin ? `<div>${escapeHTML(contact.linkedin)}</div>` : ''}
          ${contact?.portfolio ? `<div>${escapeHTML(contact.portfolio)}</div>` : ''}
        </div>
      </div>
      <div class="sidebar-section">
        <h3>Skills</h3>
        <div class="skills-sidebar">${skillsHTML}</div>
      </div>
    </div>
    <div class="main-content">
      ${summary ? `<div class="summary">${escapeHTML(summary)}</div>` : ''}
      <h2>Experience</h2>
      ${experienceHTML}
      <h2>Education</h2>
      ${educationHTML}
      ${projectsHTML ? `<h2>Projects</h2>${projectsHTML}` : ''}
    </div>
  ` : `
    <div class="full-width">
      <div class="contact-bar">
        ${contact?.email ? `<span>${escapeHTML(contact.email)}</span>` : ''}
        ${contact?.phone ? `<span>${escapeHTML(contact.phone)}</span>` : ''}
        ${contact?.linkedin ? `<span>${escapeHTML(contact.linkedin)}</span>` : ''}
      </div>
      ${summary ? `<div class="summary">${escapeHTML(summary)}</div>` : ''}
      <h2>Experience</h2>
      ${experienceHTML}
      <h2>Education</h2>
      ${educationHTML}
      ${skillsHTML ? `<h2>Skills</h2><div class="skills-row">${skillsHTML}</div>` : ''}
      ${projectsHTML ? `<h2>Projects</h2>${projectsHTML}` : ''}
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Georgia&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: ${tmpl.fontFamily};
    color: #1e293b;
    line-height: 1.5;
    font-size: 10.5pt;
  }
  
  .header {
    text-align: ${templateKey === 'minimalist' ? 'left' : 'center'};
    padding-bottom: 16px;
    border-bottom: 2px solid ${tmpl.primaryColor};
    margin-bottom: 16px;
  }
  
  .header h1 {
    font-size: 22pt;
    font-weight: 700;
    color: ${tmpl.primaryColor};
    letter-spacing: -0.5px;
  }
  
  .container {
    display: ${templateKey === 'modern' ? 'grid' : 'block'};
    ${templateKey === 'modern' ? 'grid-template-columns: 220px 1fr; gap: 24px;' : ''}
  }
  
  .sidebar {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
  }
  
  .sidebar-section { margin-bottom: 20px; }
  .sidebar-section h3 {
    font-size: 10pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${tmpl.primaryColor};
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }
  
  .contact-info div { font-size: 9.5pt; margin-bottom: 4px; color: #475569; }
  
  .skills-sidebar .skill-tag {
    display: inline-block;
    background: ${tmpl.primaryColor}15;
    color: ${tmpl.primaryColor};
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 8.5pt;
    margin: 2px;
  }
  
  .main-content h2, .full-width h2 {
    font-size: 12pt;
    color: ${tmpl.primaryColor};
    border-bottom: 1.5px solid ${tmpl.primaryColor}30;
    padding-bottom: 4px;
    margin: 16px 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .summary {
    font-size: 10pt;
    color: #475569;
    margin-bottom: 12px;
    line-height: 1.6;
  }
  
  .exp-item { margin-bottom: 12px; }
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
  }
  .exp-title { font-weight: 600; font-size: 10.5pt; }
  .exp-company { font-size: 9.5pt; color: #475569; }
  .exp-dates { font-size: 9pt; color: #64748b; white-space: nowrap; }
  
  .exp-bullets {
    margin-left: 16px;
    font-size: 9.5pt;
    color: #334155;
  }
  .exp-bullets li { margin-bottom: 3px; }
  
  .edu-item { margin-bottom: 8px; }
  .edu-degree { font-weight: 600; font-size: 10pt; }
  .edu-school { font-size: 9.5pt; color: #475569; }
  
  .skills-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .skill-tag {
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 9pt;
    color: #334155;
  }
  
  .project-item { margin-bottom: 10px; }
  .project-name { font-weight: 600; font-size: 10pt; }
  .project-desc { font-size: 9.5pt; color: #475569; }
  .project-tech { font-size: 9pt; color: #64748b; font-style: italic; }
  
  .contact-bar {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 9.5pt;
    color: #475569;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sidebar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>${escapeHTML(contact?.name || 'Your Name')}</h1>
  </div>
  <div class="container">
    ${sidebarTemplate}
  </div>
</body>
</html>`;
}

function renderCoverLetterHTML(coverLetter, templateKey) {
  const tmpl = TEMPLATES[templateKey] || TEMPLATES.modern;
  const paragraphs = (coverLetter || '').split('\n').filter(p => p.trim());
  
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${tmpl.fontFamily};
    color: #1e293b;
    line-height: 1.6;
    font-size: 11pt;
    padding: 0 0.3in;
  }
  .letter {
    max-width: 6.5in;
    margin: 0 auto;
  }
  p {
    margin-bottom: 14px;
    text-align: justify;
  }
  .salutation {
    margin-bottom: 20px;
  }
  .closing {
    margin-top: 24px;
  }
</style>
</head>
<body>
  <div class="letter">
    ${paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('\n    ')}
  </div>
</body>
</html>`;
}

// ---- PDF Rendering ----

async function renderPDF(html, options = {}) {
  try {
    // Try using Puppeteer (headless Chrome)
    const { default: puppeteer } = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: options.format || 'A4',
      margin: options.margin || { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
      printBackground: true,
    });
    
    await browser.close();
    return pdf;
  } catch (err) {
    console.error('Puppeteer PDF generation failed:', err.message);
    // Fallback: Use a simple HTML-to-text approach if puppeteer isn't available
    console.warn('Falling back to text-based output');
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return Buffer.from(text);
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}