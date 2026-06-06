import React from 'react';
import { 
  CheckCircle, 
  FileText, 
  Zap, 
  Target, 
  Layout, 
  Users, 
  ArrowRight,
  Shield,
  Star
} from 'lucide-react';

import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">ResuMate AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">
                Log in
              </button>
              <Link to="/dashboard" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary-500/25">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              The Future of Job Applications
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Land Your Dream Job with <span className="text-primary-600">AI-Powered</span> Resumes
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              ResuMate AI helps job seekers generate ATS-optimized resumes and tailored cover letters in seconds. Bridge the gap between your experience and job requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 group">
                Build My Resume Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-bold transition-all">
                View Examples
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                ATS-Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Users Hired', value: '15,000+' },
              { label: 'Resumes Generated', value: '50,000+' },
              { label: 'Success Rate', value: '85%' },
              { label: 'Time Saved', value: '12hrs/wk' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-primary-600 tracking-wide uppercase mb-3">Features</h2>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Everything you need to stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'ATS Optimization',
                description: 'Our AI ensures your resume passes through Applicant Tracking Systems by using the right keywords and formatting.',
                icon: Target,
                color: 'bg-blue-500'
              },
              {
                title: 'AI Tailoring',
                description: 'Instantly tailor your resume and cover letter for each specific job description with one click.',
                icon: Zap,
                color: 'bg-purple-500'
              },
              {
                title: 'Smart Suggestions',
                description: 'Get real-time feedback and suggestions to improve your bullet points and experience descriptions.',
                icon: Star,
                color: 'bg-amber-500'
              },
              {
                title: 'Modern Templates',
                description: 'Choose from a variety of recruiter-approved, modern templates that look great on any screen.',
                icon: Layout,
                color: 'bg-emerald-500'
              },
              {
                title: 'Application Tracking',
                description: 'Keep track of all your job applications, interviews, and follow-ups in one centralized dashboard.',
                icon: CheckCircle,
                color: 'bg-rose-500'
              },
              {
                title: 'Expert Resources',
                description: 'Access a library of career guides, interview tips, and professional advice from industry experts.',
                icon: Users,
                color: 'bg-indigo-500'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-gray-100 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-500/5 transition-all bg-white">
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-primary-600 tracking-wide uppercase mb-3">Pricing</h2>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-6">
              Simple, transparent pricing
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Invest in your career with our flexible plans designed for every stage of your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pay per Resume */}
            <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">One-off Resume</h3>
                <p className="text-gray-500">Perfect for a single application</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-gray-900">$5</span>
                <span className="text-gray-500">/resume</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  '1 AI-generated Resume',
                  '1 Tailored Cover Letter',
                  'ATS Optimization',
                  'High-quality PDF export',
                  '7 days of access'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 rounded-2xl border border-gray-200 font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                Choose Plan
              </button>
            </div>

            {/* Monthly Subscription */}
            <div className="bg-white p-10 rounded-3xl border-2 border-primary-500 shadow-xl relative flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlimited Access</h3>
                <p className="text-gray-500">For the serious job hunter</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-gray-900">$15</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  'Unlimited Resumes',
                  'Unlimited Cover Letters',
                  'Advanced ATS Optimization',
                  'Application Dashboard',
                  'Interview Prep Guides',
                  'Priority Support'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25">
                Get Started Unlimited
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-400 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Ready to land your next role?</h2>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Join 15,000+ job seekers who have successfully used ResuMate AI to accelerate their career search.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/dashboard" className="w-full sm:w-auto bg-white text-primary-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-50 transition-all flex items-center justify-center gap-2">
                Start For Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-900 bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-primary-200">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-white">4.9/5</span>
                  </div>
                  <span>Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1 rounded-lg">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">ResuMate AI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 ResuMate AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
