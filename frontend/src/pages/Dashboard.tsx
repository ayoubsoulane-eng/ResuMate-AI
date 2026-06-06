import React from 'react';
import { 
  Plus, 
  FileText, 
  Settings, 
  LogOut, 
  Layout, 
  Bell, 
  Search,
  MoreVertical,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const recentResumes = [
    { id: 1, title: 'Senior Software Engineer', company: 'Google', date: '2 hours ago', status: 'Draft' },
    { id: 2, title: 'Product Manager', company: 'Meta', date: '1 day ago', status: 'Completed' },
    { id: 3, title: 'Frontend Developer', company: 'StartupX', date: '3 days ago', status: 'Sent' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">ResuMate AI</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-semibold">
            <Layout className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            My Resumes
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Briefcase className="w-5 h-5" />
            Applications
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 w-full rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search resumes..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs border border-primary-200">
              JD
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-gray-500">Here's what's happening with your job applications.</p>
            </div>
            <Link 
              to="/builder"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Resume
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Resumes', value: '12', trend: '+2 this month', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Applications Sent', value: '45', trend: '+12 this week', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Interview Rate', value: '24%', trend: '+5% from last month', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">{stat.trend}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Resumes</h2>
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentResumes.map((resume) => (
                <div key={resume.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-white transition-colors">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{resume.title}</h3>
                      <p className="text-sm text-gray-500">{resume.company} • {resume.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      resume.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      resume.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {resume.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
