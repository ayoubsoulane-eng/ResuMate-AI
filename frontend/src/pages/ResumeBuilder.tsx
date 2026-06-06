import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Save, 
  Download, 
  Eye, 
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Experience', icon: Briefcase },
    { id: 3, name: 'Education', icon: GraduationCap },
    { id: 4, name: 'Skills', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="h-6 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">Senior Software Engineer</span>
            <span className="text-xs text-gray-500">Draft saved 1 minute ago</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Step Navigation */}
        <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col p-4 gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                currentStep === step.id 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${currentStep === step.id ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="hidden lg:block font-bold text-sm">{step.name}</span>
              {currentStep > step.id && <CheckCircle2 className="hidden lg:block w-4 h-4 ml-auto text-green-500" />}
            </button>
          ))}
          
          <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100 hidden lg:block">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Resume Score
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 w-[75%]" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Your resume is 75% complete. Add more skills to improve it.</p>
          </div>
        </aside>

        {/* Builder Area */}
        <main className="flex-grow overflow-y-auto p-8 lg:p-12">
          <div className="max-w-2xl mx-auto">
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Personal Information</h2>
                  <p className="text-gray-500">How should recruiters contact you?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Professional Title</label>
                    <input 
                      type="text" 
                      placeholder="Senior Software Engineer"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Professional Summary</label>
                  <div className="relative">
                    <textarea 
                      rows={6}
                      placeholder="Write a brief overview of your professional background..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-100 transition-all border border-primary-200">
                      <Sparkles className="w-3 h-3" />
                      Generate with AI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Work Experience</h2>
                    <p className="text-gray-500">List your most recent roles first.</p>
                  </div>
                  <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
                    <Plus className="w-5 h-5" />
                    Add Role
                  </button>
                </div>

                <div className="space-y-6">
                  {[1].map((role) => (
                    <div key={role} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-6 relative group">
                      <button className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Company</label>
                          <input 
                            type="text" 
                            defaultValue="Google"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Job Title</label>
                          <input 
                            type="text" 
                            defaultValue="Senior Software Engineer"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Achievements & Responsibilities</label>
                        <div className="space-y-3">
                          {[
                            'Led the redesign of the core search infrastructure, improving performance by 30%.',
                            'Mentored junior engineers and established best practices for React development.'
                          ].map((bullet, i) => (
                            <div key={i} className="flex gap-3 items-start group/bullet">
                              <div className="w-full relative">
                                <input 
                                  type="text" 
                                  defaultValue={bullet}
                                  className="w-full bg-gray-50/50 border border-transparent rounded-lg px-4 py-2 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all pr-10"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-500 opacity-0 group-hover/bullet:opacity-100 transition-all hover:bg-primary-50 rounded-md">
                                  <Sparkles className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button className="text-sm text-primary-600 font-bold flex items-center gap-2 mt-4 hover:underline">
                            <Plus className="w-4 h-4" />
                            Add Bullet Point
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-between border-t border-gray-200 pt-8">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  currentStep === 1 ? 'invisible' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Back
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
              >
                {currentStep === 4 ? 'Finish Builder' : 'Next Step'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        {/* AI Assistant Sidebar */}
        {aiSidebarOpen && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col hidden xl:flex">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-primary-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="font-extrabold text-gray-900">AI Assistant</span>
              </div>
              <button onClick={() => setAiSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Context-aware suggestions */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Suggestions</h3>
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-900">Missing Key Skills</p>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      For a Senior Software Engineer role at Google, consider adding **Kubernetes** and **System Design**.
                    </p>
                    <button className="text-[10px] font-bold text-amber-800 bg-amber-100/50 px-2 py-1 rounded-md hover:bg-amber-100 transition-all">
                      Add these skills
                    </button>
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-100 p-4 rounded-2xl flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary-600 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-primary-900">Quantify Achievements</p>
                    <p className="text-[11px] text-primary-700 leading-relaxed">
                      "Redesigned core infrastructure" is good, but "Improved performance by 30%" is better. Great job!
                    </p>
                  </div>
                </div>
              </div>

              {/* Tailoring Tool */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tailor for Job</h3>
                <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-4">
                  <p className="text-[11px] text-gray-500 text-center italic">Paste job description here to optimize your resume for ATS</p>
                  <textarea 
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Scan & Optimize
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">ATS Compatible</p>
                  <p className="text-[10px] text-gray-500">Your format is recruiter-friendly</p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default ResumeBuilder;
