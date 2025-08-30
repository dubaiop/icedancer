import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import RealAnalytics from '../Analytics/RealAnalytics'
import VideoAnalysis from '../VideoAnalysis'
import ImageGallery from '../ImageGallery'
import CoachDashboard from '../Coach/CoachDashboard'
import AthleteProgressSharing from '../Athlete/AthleteProgressSharing'
import { 
  BarChart3, 
  Camera, 
  Trophy, 
  Target, 
  TrendingUp,
  Brain,
  Award,
  Clock,
  CheckCircle,
  Image,
  Sparkles,
  LogOut,
  Bell,
  Search,
  Calendar,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Users,
  MessageSquare
} from 'lucide-react'

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')


  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'video', label: 'Video Analysis', icon: <Camera className="h-4 w-4" /> },
    { id: 'training', label: 'Training Tools', icon: <Target className="h-4 w-4" /> },
    { id: 'gallery', label: 'Image Gallery', icon: <Image className="h-4 w-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
    ...(user?.role === 'coach' ? [
      { id: 'coach', label: 'Coach Dashboard', icon: <Users className="h-4 w-4" /> }
    ] : []),
    ...(user?.role === 'athlete' ? [
      { id: 'sharing', label: 'Progress Sharing', icon: <MessageSquare className="h-4 w-4" /> }
    ] : [])
  ]

  const quickStats = [
    { label: 'Sessions This Week', value: '12', change: '+3', icon: <Camera className="h-5 w-5" /> },
    { label: 'Average Score', value: '8.4', change: '+0.2', icon: <Trophy className="h-5 w-5" /> },
    { label: 'Elements Mastered', value: '24', change: '+2', icon: <Target className="h-5 w-5" /> },
    { label: 'Training Hours', value: '18.5', change: '+2.5', icon: <Clock className="h-5 w-5" /> }
  ]

  const recentSessions = [
    { date: '2024-01-15', program: 'Free Dance', score: 8.6, elements: 12, duration: '4:32', status: 'completed' },
    { date: '2024-01-14', program: 'Rhythm Dance', score: 8.1, elements: 8, duration: '3:15', status: 'completed' },
    { date: '2024-01-13', program: 'Free Dance', score: 8.3, elements: 11, duration: '4:28', status: 'completed' },
    { date: '2024-01-12', program: 'Rhythm Dance', score: 7.9, elements: 7, duration: '3:08', status: 'completed' }
  ]

  const upcomingSessions = [
    { date: '2024-01-16', time: '10:00 AM', type: 'Training Session', coach: 'Coach Sarah' },
    { date: '2024-01-17', time: '2:00 PM', type: 'Video Analysis', coach: 'AI Coach' },
    { date: '2024-01-18', time: '9:00 AM', type: 'Competition Prep', coach: 'Coach Mike' }
  ]

  const trainingModules = [
    {
      title: 'Twizzle Mastery',
      description: 'Advanced twizzle technique and execution',
      difficulty: 'Advanced',
      duration: '45 min',
      progress: 85,
      completed: false,
      nextSession: 'Today, 2:00 PM'
    },
    {
      title: 'Lift Fundamentals',
      description: 'Basic lift techniques and safety',
      difficulty: 'Intermediate',
      duration: '30 min',
      progress: 100,
      completed: true,
      nextSession: 'Completed'
    },
    {
      title: 'Edge Quality',
      description: 'Improving edge control and flow',
      difficulty: 'Intermediate',
      duration: '40 min',
      progress: 70,
      completed: false,
      nextSession: 'Tomorrow, 10:00 AM'
    },
    {
      title: 'Performance Expression',
      description: 'Artistic interpretation and musicality',
      difficulty: 'Advanced',
      duration: '50 min',
      progress: 45,
      completed: false,
      nextSession: 'Jan 20, 3:00 PM'
    }
  ]

  const achievements = [
    { title: 'First Perfect Score', description: 'Achieved 10.0 on twizzle sequence', icon: <Award className="h-5 w-5" />, date: '2 days ago' },
    { title: 'Consistency Master', description: '5 consecutive sessions above 8.0', icon: <TrendingUpIcon className="h-5 w-5" />, date: '1 week ago' },
    { title: 'Element Explorer', description: 'Mastered 20+ technical elements', icon: <TargetIcon className="h-5 w-5" />, date: '2 weeks ago' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <RealAnalytics />
      case 'video':
        return <VideoAnalysis />
      case 'gallery':
        return <ImageGallery />
      case 'coach':
        return <CoachDashboard />
      case 'sharing':
        return <AthleteProgressSharing />
      case 'schedule':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Training Schedule
                </CardTitle>
                <CardDescription>
                  Your upcoming training sessions and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.type}</h4>
                          <p className="text-sm text-slate-600">{session.date} at {session.time}</p>
                          <p className="text-sm text-slate-500">with {session.coach}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Join Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'training':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Modules</CardTitle>
                <CardDescription>
                  AI-powered training programs tailored to your skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {trainingModules.map((module, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <Badge variant={module.difficulty === 'Advanced' ? 'destructive' : 'secondary'}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4" />
                              {module.duration}
                            </div>
                            {module.completed && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            Next: {module.nextSession}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
                    <p className="text-blue-100">Ready to elevate your ice dance performance with AI?</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{user.avatar}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last week</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Training Sessions</CardTitle>
                  <CardDescription>
                    Your latest performance analysis and scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{session.program}</h4>
                            <p className="text-sm text-slate-500">{session.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Score</p>
                            <p className="text-xl font-bold text-blue-600">{session.score}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600">Duration</p>
                            <p className="text-xl font-bold">{session.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>
                    Recent milestones and accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-slate-600">{achievement.description}</p>
                          <p className="text-xs text-slate-500">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights & Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on your performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Excellent twizzle execution (94% accuracy)</li>
                        <li>• Strong edge control in step sequences</li>
                        <li>• Consistent lift technique</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Spin stability needs work</li>
                        <li>• Transitions could be smoother</li>
                        <li>• Artistic expression scoring</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
                      <ul className="space-y-1 text-sm text-purple-700">
                        <li>• Focus on spin practice (30 min daily)</li>
                        <li>• Work on transition drills</li>
                        <li>• Review artistic interpretation videos</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Competition Readiness</h4>
                      <p className="text-sm text-yellow-700">
                        Based on your recent performances, you&apos;re 85% ready for competition. 
                        Focus on the recommended areas to reach 95% readiness.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  AI Ice Dancer
                </h1>
                <p className="text-xs text-slate-600">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-slate-600">{user.email}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.avatar}
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </div>


    </div>
  )
}

export default Dashboard 